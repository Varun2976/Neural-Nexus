import React, { useState, useEffect } from 'react';
import useShieldEngine from './src/hooks/useShieldEngine';
import ShieldStatus from './src/components/ShieldStatus';
import MetricCards from './src/components/MetricCards';
import ScanHistory from './src/components/ScanHistory';
import VoiceEnroll from './src/components/VoiceEnroll';
import Login from './src/components/Login';
import Register from './src/components/Register';
import { loginUser, registerUser, getMe } from './src/services/apiClient';
import './src/styles/global.css';
import './src/styles/auth.css';

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [authLoading, setAuthLoading] = useState(true);

  const { isActive, scans, metrics, loading, toggleShield, performScan } = useShieldEngine();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('nn_token');
    if (token) {
      getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token is invalid or expired, clear it
          localStorage.removeItem('nn_token');
        })
        .finally(() => {
          setAuthLoading(false);
        });
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('nn_token', data.token);
    setUser(data.user);
  };

  const handleRegister = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem('nn_token', data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('nn_token');
    setUser(null);
    setAuthView('login');
  };

  // Loading screen while checking auth
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
        <div className="auth-container" style={{ textAlign: 'center' }}>
          <div className="auth-brand__icon" style={{ margin: '0 auto 1rem' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="shield-grad-load" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f8cff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
                    stroke="url(#shield-grad-load)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span className="auth-spinner" style={{ width: 28, height: 28, borderColor: 'rgba(79,140,255,0.2)', borderTopColor: '#4f8cff' }} />
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    if (authView === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  // Main app (authenticated)
  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Shield</h1>
          <p>AI-Powered Threat Detection</p>
        </div>
        <div className="app__user-info">
          <span className="app__user-name">{user.name || user.email}</span>
          <button className="app__logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
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
