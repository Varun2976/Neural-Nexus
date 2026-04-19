let activeClients = new Set();

export function setActiveClients(clients) {
  activeClients = clients;
}

export function broadcastThreat(flaggedContent) {
  const message = JSON.stringify({
    type: 'NEW_THREAT',
    contentHash: flaggedContent.contentHash,
    contentType: flaggedContent.contentType,
    label: flaggedContent.label,
    riskScore: flaggedContent.riskScore,
    detectedCount: flaggedContent.detectedCount
  });

  activeClients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}
