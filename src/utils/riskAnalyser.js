/**
 * Risk analysis engine
 */

export function analyseRisk(features) {
  const weights = {
    urlLength: 0.15,
    hasSuspiciousChars: 0.25,
    domainAge: 0.2,
    sslValid: 0.15,
    redirectCount: 0.1,
    contentSimilarity: 0.15,
  };

  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (features[key] !== undefined) {
      score += features[key] * weight;
    }
  }

  return Math.min(Math.max(score, 0), 1);
}

export function generateRiskReport(url, features, score) {
  return {
    url,
    features,
    score,
    level: score >= 0.8 ? 'critical' : score >= 0.5 ? 'warning' : 'safe',
    timestamp: Date.now(),
  };
}
