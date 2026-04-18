import React from 'react';

const ThreatAlert = ({ threat }) => {
  const { type, severity, message, timestamp } = threat || {};

  const severityColors = {
    high: '#ff4444',
    medium: '#ffaa00',
    low: '#44cc44',
  };

  return (
    <div className="threat-alert" style={{ borderLeft: `4px solid ${severityColors[severity] || '#ccc'}` }}>
      <div className="threat-alert__header">
        <span className="threat-alert__type">{type || 'Unknown'}</span>
        <span className="threat-alert__severity">{severity || 'N/A'}</span>
      </div>
      <p className="threat-alert__message">{message || 'No details available'}</p>
      <span className="threat-alert__time">{timestamp ? new Date(timestamp).toLocaleString() : ''}</span>
    </div>
  );
};

export default ThreatAlert;
