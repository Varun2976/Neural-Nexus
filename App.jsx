import React from 'react';
import useShieldEngine from './src/hooks/useShieldEngine';
import ShieldStatus from './src/components/ShieldStatus';
import MetricCards from './src/components/MetricCards';
import ScanHistory from './src/components/ScanHistory';
import VoiceEnroll from './src/components/VoiceEnroll';
import './src/styles/global.css';

function App() {
  const { isActive, scans, metrics, loading, toggleShield, performScan } = useShieldEngine();

  return (
    <div className="app">
      <header className="app__header">
        <h1>🛡️ Shield</h1>
        <p>AI-Powered Threat Detection</p>
      </header>

      <main className="app__main">
        <ShieldStatus isActive={isActive} onToggle={toggleShield} />
        <MetricCards metrics={metrics} />
        <ScanHistory scans={scans} />
        <VoiceEnroll />
      </main>
    </div>
  );
}

export default App;
