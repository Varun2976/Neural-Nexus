import React from 'react';

const MetricCards = ({ metrics = {} }) => {
  const { totalScans = 0, threatsBlocked = 0, safeLinks = 0, riskScore = 0 } = metrics;

  const cards = [
    { label: 'Total Scans', value: totalScans, icon: '🔍' },
    { label: 'Threats Blocked', value: threatsBlocked, icon: '🛑' },
    { label: 'Safe Links', value: safeLinks, icon: '✅' },
    { label: 'Risk Score', value: `${riskScore}%`, icon: '⚠️' },
  ];

  return (
    <div className="metric-cards">
      {cards.map((card) => (
        <div key={card.label} className="metric-card">
          <span className="metric-card__icon">{card.icon}</span>
          <div className="metric-card__content">
            <h3 className="metric-card__value">{card.value}</h3>
            <p className="metric-card__label">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
