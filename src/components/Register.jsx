import React, { useState } from 'react';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#ff4444' };
    if (score <= 2) return { level: 2, label: 'Fair', color: '#ffaa00' };
    if (score <= 3) return { level: 3, label: 'Good', color: '#66bb6a' };
    return { level: 4, label: 'Strong', color: '#44cc44' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await onRegister(name, email, password);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="auth-bg-orb auth-bg-orb--1" />
      <div className="auth-bg-orb auth-bg-orb--2" />
      <div className="auth-bg-orb auth-bg-orb--3" />

      <div className="auth-container">
        {/* Brand header */}
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <defs>
                <linearGradient id="shield-grad-r" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#4f8cff" />
                </linearGradient>
              </defs>
              <path d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z" 
                    fill="url(#shield-grad-r)" opacity="0.2" />
              <path d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z" 
                    stroke="url(#shield-grad-r)" strokeWidth="2" fill="none" />
              <path d="M16 24l5 5 11-11" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" 
                    strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h1 className="auth-brand__title">Neural Nexus</h1>
          <p className="auth-brand__subtitle">Join the Shield Network</p>
        </div>

        {/* Register card */}
        <div className="auth-card">
          <div className="auth-card__header">
            <h2 className="auth-card__title">Create account</h2>
            <p className="auth-card__desc">Start protecting yourself with AI-powered security</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 6h2v2H7v-2z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name" className="auth-field__label">Full Name</label>
              <div className="auth-field__input-wrap">
                <svg className="auth-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="auth-field__input"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email" className="auth-field__label">Email</label>
              <div className="auth-field__input-wrap">
                <svg className="auth-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-field__input"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password" className="auth-field__label">Password</label>
              <div className="auth-field__input-wrap">
                <svg className="auth-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="auth-field__input"
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password strength meter */}
              {password && (
                <div className="auth-strength">
                  <div className="auth-strength__bar">
                    {[1, 2, 3, 4].map((segment) => (
                      <div
                        key={segment}
                        className="auth-strength__segment"
                        style={{
                          backgroundColor: segment <= strength.level ? strength.color : 'rgba(255,255,255,0.08)'
                        }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength__label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm" className="auth-field__label">Confirm Password</label>
              <div className="auth-field__input-wrap">
                <svg className="auth-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="auth-field__input"
                  autoComplete="new-password"
                  disabled={loading}
                />
                {confirmPassword && password === confirmPassword && (
                  <svg className="auth-field__check" width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="#44cc44" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit auth-submit--register"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-submit__loader">
                  <span className="auth-spinner" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            Already have an account?{' '}
            <button
              type="button"
              className="auth-switch__link"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>

        <p className="auth-footer">
          Protected by Neural Nexus Shield™
        </p>
      </div>
    </div>
  );
};

export default Register;
