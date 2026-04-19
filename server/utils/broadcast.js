let activeClients = new Map(); // Map<userId, WebSocket>

export function setActiveClients(clients) {
  activeClients = clients;
}

export function broadcastThreat(flaggedContent) {
  const payload = JSON.stringify({
    type: 'NEW_THREAT',
    contentHash: flaggedContent.contentHash,
    contentType: flaggedContent.contentType,
    label: flaggedContent.label,
    riskScore: flaggedContent.riskScore,
    detectedCount: flaggedContent.detectedCount,
    explanation: flaggedContent.explanation,
    timestamp: Date.now()
  });

  let delivered = 0;
  activeClients.forEach((ws) => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(payload);
      delivered++;
    }
  });

  console.log(`[Shield WS] Threat broadcast to ${delivered} active clients`);
}
