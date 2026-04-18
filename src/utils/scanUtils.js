/**
 * Scan utility helpers
 */

export function classifyRisk(score) {
  if (score >= 0.8) return 'high';
  if (score >= 0.5) return 'medium';
  return 'low';
}

export function formatScanResult(raw) {
  return {
    id: raw.id || crypto.randomUUID(),
    url: raw.url,
    status: classifyRisk(raw.confidence),
    confidence: raw.confidence,
    timestamp: raw.timestamp || Date.now(),
  };
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
