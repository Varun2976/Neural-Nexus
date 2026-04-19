let ws = null;
let jwt = null;
let blocklist = new Set();

// Load blocklist from chrome storage on startup
chrome.storage.local.get(['blocklist', 'token'], (result) => {
  if (result.blocklist) {
    blocklist = new Set(result.blocklist);
  }
  jwt = result.token;
  if (jwt) {
    connectWebSocket();
  }
});

function connectWebSocket() {
  if (!jwt) return;

  const wsUrl = `ws://localhost:3000?token=${encodeURIComponent(jwt)}`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('Connected to Neural-Nexus WebSocket');
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === 'NEW_THREAT') {
        console.log('NEW_THREAT received:', message.contentHash);

        // Add to blocklist
        blocklist.add(message.contentHash);

        // Save to chrome storage
        chrome.storage.local.set({
          blocklist: Array.from(blocklist),
          lastUpdateTime: new Date().toISOString()
        });

        // Optional: Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('icon128.png'),
          title: 'Neural-Nexus Threat Alert',
          message: `New threat detected: ${message.label} (Risk: ${(message.riskScore * 100).toFixed(0)}%)`
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Reconnect after 5 seconds
    setTimeout(connectWebSocket, 5000);
  };
}

// Listen for token updates to reconnect WebSocket
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.token) {
    jwt = changes.token.newValue;
    if (jwt && ws && ws.readyState === 3) { // WebSocket.CLOSED
      connectWebSocket();
    }
  }
});

// Helper function to compute SHA-256 hash
async function computeHash(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Function to check if content is in blocklist
async function isBlocked(content) {
  const hash = await computeHash(content);
  return blocklist.has(hash);
}

// Expose to content scripts via message passing
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_BLOCKLIST') {
    isBlocked(request.content).then((isBlocked) => {
      sendResponse({ blocked: isBlocked });
    });
    return true; // Keep the message channel open for async response
  }

  if (request.type === 'GET_BLOCKLIST_SIZE') {
    sendResponse({ size: blocklist.size });
  }
});

export { connectWebSocket, isBlocked, blocklist };
