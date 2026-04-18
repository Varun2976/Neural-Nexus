import React from 'react';

const ShieldStatus = ({ isActive = false, onToggle }) => {
  return (
    <div className={`shield-status ${isActive ? 'shield-status--active' : 'shield-status--inactive'}`}>
      <div className="shield-status__icon">🛡️</div>
      <h2 className="shield-status__title">
        Shield is {isActive ? 'Active' : 'Inactive'}
      </h2>
      <p className="shield-status__description">
        {isActive
          ? 'Your browsing is being protected in real-time.'
          : 'Shield is currently paused. Click to activate.'}
      </p>
      <button className="shield-status__toggle" onClick={onToggle}>
        {isActive ? 'Pause Shield' : 'Activate Shield'}
      </button>
    </div>
  );
};

export default ShieldStatus;
