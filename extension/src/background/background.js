const API_BASE = 'http://localhost:3000/api';
const WS_URL = 'ws://localhost:3000';

let ws = null;
let jwt = null;

// Helper function to compute SHA-256 hash
async function computeHash(content) {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Add hash to local blocklist
async function addToLocalBlocklist(hash, data) {
  const { blocklist = {} } = await chrome.storage.local.get('blocklist');
  blocklist[hash] = { ...data, cachedAt: Date.now() };
  await chrome.storage.local.set({ blocklist });
  console.log(`[Shield] Blocked hash cached: ${hash}`);

  // Cleanup old entries (older than 7 days)
  cleanupOldBlocklistEntries();
}

// Cleanup old blocklist entries (7 days)
async function cleanupOldBlocklistEntries() {
  const { blocklist = {} } = await chrome.storage.local.get('blocklist');
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let cleaned = 0;

  for (const hash in blocklist) {
    const entry = blocklist[hash];
    if (!entry.cachedAt) {
      // Migrate old entries without cachedAt
      entry.cachedAt = now;
    } else if (now - entry.cachedAt > sevenDaysMs) {
      // Remove entries older than 7 days
      delete blocklist[hash];
      cleaned++;
    }
  }

  if (cleaned > 0) {
    await chrome.storage.local.set({ blocklist });
    console.log(`[Shield] Cleaned up ${cleaned} stale blocklist entries`);
  }
}

// Check if hash is in local blocklist
export async function isLocallyBlocked(hash) {
  const { blocklist = {} } = await chrome.storage.local.get('blocklist');
  return blocklist[hash] || null;
}

// Connect to WebSocket server
function connectWebSocket() {
  chrome.storage.local.get('token', (result) => {
    jwt = result.token;

    if (!jwt) {
      console.log('[Shield] No JWT token - user not logged in. Retrying in 5s...');
      setTimeout(connectWebSocket, 5000);
      return;
    }

    const wsUrl = `${WS_URL}?token=${encodeURIComponent(jwt)}`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[Shield] WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'CONNECTED') {
          console.log(`[Shield] ${msg.message}`);
        } else if (msg.type === 'NEW_THREAT') {
          console.log('[Shield] NEW_THREAT received:', msg.contentHash);
          addToLocalBlocklist(msg.contentHash, msg);

          // Show notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icon128.png'),
            title: 'Neural-Nexus Threat Alert',
            message: `${msg.label} - Risk: ${(msg.riskScore * 100).toFixed(0)}%`
          });
        }
      } catch (error) {
        console.error('[Shield] Error processing WS message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[Shield] WS error:', error);
    };

    ws.onclose = () => {
      console.log('[Shield] WS disconnected, reconnecting in 3s...');
      setTimeout(connectWebSocket, 3000);
    };
  });
}

// Listen for token updates
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.token) {
    jwt = changes.token.newValue;
    if (jwt && ws && ws.readyState === 3) { // WebSocket.CLOSED
      connectWebSocket();
    }
  }
});

// Message listener for scan requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCAN_TEXT') {
    handleScan('text', { text: request.payload.text }, sendResponse);
    return true;
  }

  if (request.type === 'SCAN_URL') {
    handleScan('url', { url: request.payload.url }, sendResponse);
    return true;
  }

  if (request.type === 'SCAN_AUDIO') {
    handleScan('audio', { b64: request.payload.b64 }, sendResponse);
    return true;
  }

  if (request.type === 'GET_HISTORY') {
    // TODO: Implement history retrieval
    sendResponse({ ok: true, history: [] });
    return true;
  }

  if (request.type === 'USER_FEEDBACK') {
    // TODO: Implement feedback submission
    sendResponse({ ok: true, message: 'Feedback recorded' });
    return true;
  }
});

// Scan handler with local blocklist check
async function handleScan(type, payload, sendResponse) {
  try {
    // Step 1: Compute hash
    const content = payload.text || payload.url || payload.b64 || '';
    const hash = await computeHash(content);

    // Step 2: Check local blocklist (instant, no network)
    const blocked = await isLocallyBlocked(hash);
    if (blocked) {
      console.log(`[Shield] Hash found in local blocklist: ${hash}`);
      sendResponse({
        ok: true,
        result: {
          riskScore: 1.0,
          label: blocked.label || 'Blocked',
          fromCache: true,
          explanation: `Flagged by Neural-Nexus network. Detected ${blocked.detectedCount} times.`
        }
      });
      return;
    }

    // Step 3: Call Express API (which checks Deepfake_DB then model server)
    const endpoint = `/api/scan/${type}`;
    const response = await fetch(`${API_BASE}/scan/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    sendResponse({ ok: true, result });
  } catch (error) {
    console.error('[Shield] Scan error:', error);
    sendResponse({ ok: false, error: error.message });
  }
}

// Start WebSocket connection on extension load
connectWebSocket();

// Cleanup stale blocklist entries on startup
cleanupOldBlocklistEntries();

export { connectWebSocket, isLocallyBlocked, computeHash };
