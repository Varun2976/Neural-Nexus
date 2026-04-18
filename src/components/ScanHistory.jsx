import React from 'react';

const ScanHistory = ({ scans = [] }) => {
  return (
    <div className="scan-history">
      <h2>Scan History</h2>
      {scans.length === 0 ? (
        <p className="scan-history__empty">No scans yet</p>
      ) : (
        <ul className="scan-history__list">
          {scans.map((scan, index) => (
            <li key={scan.id || index} className="scan-history__item">
              <span className="scan-history__url">{scan.url}</span>
              <span className={`scan-history__status scan-history__status--${scan.status}`}>
                {scan.status}
              </span>
              <span className="scan-history__date">
                {new Date(scan.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScanHistory;
