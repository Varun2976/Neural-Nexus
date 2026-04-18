import React, { useState } from 'react';

function App() {
  const [status, setStatus] = useState('active');

  return (
    <div className="popup-container">
      <h1>🛡️ Shield</h1>
      <p>Status: <span className={`status-${status}`}>{status}</span></p>
      <button onClick={() => setStatus(status === 'active' ? 'paused' : 'active')}>
        {status === 'active' ? 'Pause' : 'Activate'}
      </button>
    </div>
  );
}

export default App;
