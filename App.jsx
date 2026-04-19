<<<<<<< HEAD
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
=======
// AegisX — Neural Command Interface
// Full single-file React component — renders in Claude artifact viewer
import { useState, useEffect, useRef, useCallback } from "react";

const rand = (min, max) => Math.random() * (max - min) + min;

function useAnimationFrame(callback, running = true) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    if (!running) return;
    let id;
    const loop = (t) => { cbRef.current(t); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running]);
}

function NeuralCanvas({ threatLevel = 0 }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const timeRef = useRef(0);
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.width = el.offsetWidth; el.height = el.offsetHeight;
    nodesRef.current = Array.from({ length: 38 }, () => ({
      x: rand(0, el.width), y: rand(0, el.height),
      vx: rand(-0.16, 0.16), vy: rand(-0.16, 0.16),
      r: rand(1.2, 3), pulse: rand(0, Math.PI * 2),
    }));
  }, []);
  useAnimationFrame((t) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    timeRef.current = t * 0.001;
    ctx.clearRect(0, 0, W, H);
    const nodes = nodesRef.current;
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.pulse += 0.018;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const a = (1 - dist / 150) * 0.16;
          const col = threatLevel > 0.6 ? `rgba(255,77,109,${a})` : threatLevel > 0.3 ? `rgba(124,58,237,${a * 1.4})` : `rgba(6,182,212,${a})`;
          ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      const p = (Math.sin(n.pulse) + 1) * 0.5, r = n.r + p * 1.2;
      const col = threatLevel > 0.6 ? "255,77,109" : threatLevel > 0.3 ? "124,58,237" : "6,182,212";
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
      g.addColorStop(0, `rgba(${col},${0.6 + p * 0.4})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${col},0.9)`; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
    });
    const cx = W / 2, cy = H / 2, rad = (timeRef.current * 80) % (Math.max(W, H) * 0.85);
    const g2 = ctx.createRadialGradient(cx, cy, rad * 0.92, cx, cy, rad);
    g2.addColorStop(0, "rgba(124,58,237,0)");
    g2.addColorStop(0.7, `rgba(124,58,237,${(1 - rad / (Math.max(W, H) * 0.85)) * 0.035})`);
    g2.addColorStop(1, "rgba(124,58,237,0)");
    ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", resize); return () => window.removeEventListener("resize", resize);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function ScanRing({ scanning, result }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  useAnimationFrame(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, R = W * 0.42;
    ctx.clearRect(0, 0, W, H);
    const col = result === "safe" ? "6,212,114" : result === "threat" ? "255,77,109" : result === "suspicious" ? "251,191,36" : "6,182,212";
    for (let i = 4; i >= 1; i--) {
      ctx.beginPath(); ctx.strokeStyle = `rgba(${col},${0.04 * i})`; ctx.lineWidth = i * 5;
      ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.beginPath(); ctx.strokeStyle = `rgba(${col},0.14)`; ctx.lineWidth = 0.8;
    ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2, inner = i % 5 === 0 ? R - 9 : R - 4;
      ctx.beginPath(); ctx.strokeStyle = `rgba(${col},${i % 5 === 0 ? 0.45 : 0.18})`; ctx.lineWidth = i % 5 === 0 ? 1.4 : 0.7;
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
    }
    if (scanning) {
      angleRef.current += 0.042;
      const a = angleRef.current;
      ctx.beginPath(); ctx.strokeStyle = `rgba(${col},0.9)`; ctx.lineWidth = 2.5;
      ctx.arc(cx, cy, R, a - 0.07, a); ctx.stroke();
      for (let s = 0; s < 22; s++) {
        ctx.beginPath(); ctx.strokeStyle = `rgba(${col},${(1 - s / 22) * 0.14})`; ctx.lineWidth = 1.8;
        ctx.arc(cx, cy, R, a - s * 0.08, a - (s - 1) * 0.08); ctx.stroke();
      }
      ctx.beginPath(); ctx.strokeStyle = `rgba(${col},0.35)`; ctx.lineWidth = 0.8;
      ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
      for (let d = 0; d < 5; d++) {
        const dr = rand(R * 0.15, R * 0.85), da = a + rand(-0.25, 0.08);
        ctx.fillStyle = `rgba(${col},${rand(0.4, 0.95)})`;
        ctx.beginPath(); ctx.arc(cx + Math.cos(da) * dr, cy + Math.sin(da) * dr, rand(1, 2.5), 0, Math.PI * 2); ctx.fill();
      }
    }
    if (result) {
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55);
      rg.addColorStop(0, `rgba(${col},0.1)`); rg.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }
  }, true);
  useEffect(() => {
    const c = canvasRef.current; c.width = 320; c.height = 320;
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 320, height: "auto", display: "block", margin: "0 auto" }} />;
}

function WaveformBar({ active, threatColor }) {
  const canvasRef = useRef(null);
  const barsRef = useRef(Array.from({ length: 44 }, () => ({ h: 0.07, target: 0.07 })));
  useAnimationFrame(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const bars = barsRef.current, bw = W / bars.length;
    bars.forEach((bar, i) => {
      if (active) { bar.target = rand(0.06, 0.94); bar.h += (bar.target - bar.h) * 0.11; }
      else { bar.h += (0.06 - bar.h) * 0.05; }
      const bh = bar.h * H, col = threatColor || "6,182,212";
      const g = ctx.createLinearGradient(0, H / 2 - bh / 2, 0, H / 2 + bh / 2);
      g.addColorStop(0, `rgba(${col},0.9)`); g.addColorStop(0.5, `rgba(${col},0.35)`); g.addColorStop(1, `rgba(${col},0.9)`);
      ctx.fillStyle = g;
      ctx.fillRect(i * bw + 1, H / 2 - bh / 2, bw - 2, bh);
    });
  }, true);
  useEffect(() => {
    const c = canvasRef.current;
    const update = () => { c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; };
    update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 64, display: "block" }} />;
}

function ThreatNodes({ threats }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  useEffect(() => {
    if (!threats.length) return;
    const c = canvasRef.current;
    const W = c.width, H = c.height;
    nodesRef.current = threats.map(t => ({
      ...t, x: rand(60, W - 60), y: rand(40, H - 40),
      vx: rand(-0.28, 0.28), vy: rand(-0.28, 0.28), pulse: rand(0, Math.PI * 2),
    }));
  }, [threats]);
  useAnimationFrame(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const nodes = nodesRef.current; if (!nodes.length) return;
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 50 || n.x > W - 50) n.vx *= -1;
      if (n.y < 40 || n.y > H - 40) n.vy *= -1;
      n.pulse += 0.022;
    });
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
      const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 180) {
        ctx.beginPath(); ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 180) * 0.28})`; ctx.lineWidth = 0.7;
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }));
    nodes.forEach(n => {
      const p = (Math.sin(n.pulse) + 1) * 0.5, r = 10 + p * 4;
      const col = n.level === "threat" ? "255,77,109" : n.level === "suspicious" ? "251,191,36" : "6,212,114";
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.2);
      g.addColorStop(0, `rgba(${col},0.75)`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${col},0.9)`; ctx.beginPath(); ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center";
      ctx.fillText(n.label, n.x, n.y + r * 2.5 + 4);
    });
  }, true);
  useEffect(() => {
    const c = canvasRef.current;
    const update = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: 180, display: "block" }} />;
}

function GlitchText({ text }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true); setTimeout(() => setGlitch(false), 140);
    }, rand(3500, 7500));
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{
      display: "inline-block", position: "relative",
      ...(glitch && { textShadow: "2px 0 #7C3AED,-2px 0 #06B6D4", transform: `skewX(${rand(-1.5, 1.5)}deg)` }),
      transition: "transform 0.05s",
    }}>{text}</span>
  );
}
>>>>>>> ae7f3b2 (SOme shit)

function ScanLine({ scanning }) {
  const [pos, setPos] = useState(-5);
  useEffect(() => {
    if (!scanning) return;
    let p = -5;
    const iv = setInterval(() => { p += 2.2; if (p > 108) p = -5; setPos(p); }, 16);
    return () => clearInterval(iv);
  }, [scanning]);
  if (!scanning) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 10 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: `${pos}%`, height: 2, background: "linear-gradient(90deg,transparent,#06B6D4,#7C3AED,#06B6D4,transparent)", boxShadow: "0 0 14px #06B6D4,0 0 28px #7C3AED" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: `${pos}%`, height: 70, background: "linear-gradient(180deg,rgba(6,182,212,0.05),transparent)" }} />
    </div>
  );
}

function ConfidenceBar({ value, label, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 80); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6B7280", marginBottom: 4, fontFamily: "monospace" }}>
        <span>{label}</span><span style={{ color }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg,${color}66,${color})`, boxShadow: `0 0 7px ${color}`, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

function TypedText({ text, speed = 30, style }) {
  const [d, setD] = useState("");
  useEffect(() => {
    setD(""); let i = 0;
    const iv = setInterval(() => { setD(text.slice(0, i)); i++; if (i > text.length) clearInterval(iv); }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span style={style}>{d}<span style={{ opacity: 0.4 }}>▌</span></span>;
}

function StatusBadge({ status }) {
  const c = {
    safe: { color: "#06D472", bg: "rgba(6,212,114,0.1)", label: "SAFE", border: "rgba(6,212,114,0.28)" },
    suspicious: { color: "#FBB724", bg: "rgba(251,183,36,0.1)", label: "SUSPICIOUS", border: "rgba(251,183,36,0.28)" },
    threat: { color: "#FF4D6D", bg: "rgba(255,77,109,0.1)", label: "THREAT DETECTED", border: "rgba(255,77,109,0.28)" },
    scanning: { color: "#06B6D4", bg: "rgba(6,182,212,0.08)", label: "SCANNING...", border: "rgba(6,182,212,0.28)" },
    idle: { color: "#4B5563", bg: "rgba(75,85,99,0.07)", label: "STANDBY", border: "rgba(75,85,99,0.2)" },
  }[status] || { color: "#4B5563", bg: "rgba(75,85,99,0.07)", label: "STANDBY", border: "rgba(75,85,99,0.2)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: c.bg, border: `1px solid ${c.border}` }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, boxShadow: `0 0 7px ${c.color}`, animation: status === "scanning" ? "pulse 0.75s infinite" : "none" }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: c.color, fontFamily: "monospace" }}>{c.label}</span>
    </span>
  );
}

const RESULTS = {
  phishing: [
    { result: "threat", confidence: 97.3, threats: ["Urgency manipulation", "Credential harvesting", "Link obfuscation"] },
    { result: "suspicious", confidence: 61.5, threats: ["Attachment vector", "Spoofed sender pattern"] },
    { result: "safe", confidence: 98.7, threats: [] },
  ],
  audio: [
    { result: "threat", confidence: 91.6, threats: ["Voice cloning detected", "GAN artifacts", "Frequency anomalies"] },
    { result: "suspicious", confidence: 55.1, threats: ["Compression artifacts", "Spectral mismatch"] },
    { result: "safe", confidence: 96.4, threats: [] },
  ],
  image: [
    { result: "threat", confidence: 88.9, threats: ["Face swap detected", "GAN fingerprint", "Edge inconsistency"] },
    { result: "safe", confidence: 99.1, threats: [] },
  ],
};

function getMock(type, input) {
  const pool = RESULTS[type];
  if (type === "phishing") {
    const l = (input || "").toLowerCase();
    if (l.includes("urgent") || l.includes("click") || l.includes("verify") || l.includes("suspend") || l.includes("payp")) return pool[0];
    if (l.includes("invoice") || l.includes("attach") || l.includes("download") || l.includes("pdf")) return pool[1];
    return pool[2];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function AegisX() {
  const [phase, setPhase] = useState("hero");
  const [scanType, setScanType] = useState("phishing");
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState(null);
  const [scanState, setScanState] = useState("idle");
  const [result, setResult] = useState(null);
  const [threatLevel, setThreatLevel] = useState(0.05);
  const [modelLearning, setModelLearning] = useState(null);
  const [history, setHistory] = useState([]);
  const [audioActive, setAudioActive] = useState(false);
  const fileRef = useRef(null);

  const handleScan = useCallback(() => {
    if (scanType === "phishing" && !inputText.trim()) return;
    setScanState("scanning"); setResult(null);
    setTimeout(() => {
      const r = getMock(scanType, inputText);
      setResult(r); setScanState("result");
      setThreatLevel(r.result === "threat" ? 0.85 : r.result === "suspicious" ? 0.45 : 0.05);
      setHistory(h => [{ type: scanType, result: r, input: inputText || fileName || "audio file", ts: new Date().toLocaleTimeString() }, ...h.slice(0, 4)]);
    }, rand(2400, 3600));
  }, [scanType, inputText, fileName]);

  const handleFeedback = (t) => { setModelLearning(t); setTimeout(() => setModelLearning(null), 2800); };

  const scanColor = result
    ? result.result === "safe" ? "#06D472" : result.result === "threat" ? "#FF4D6D" : "#FBB724"
    : "#06B6D4";

  const css = `
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes learning{0%{width:0%}100%{width:100%}}
    @keyframes glow{0%,100%{opacity:0.55}50%{opacity:1}}
    @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#060816}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#7C3AED40}
    textarea{resize:vertical}
    textarea:focus{outline:none}
    .btn-scan:hover{box-shadow:0 0 50px rgba(124,58,237,0.75)!important}
    .btn-cta:hover{box-shadow:0 0 60px rgba(124,58,237,0.8),0 0 120px rgba(124,58,237,0.35)!important}
    .sample-btn:hover{border-color:rgba(124,58,237,0.4)!important;color:#9CA3AF!important}
    .type-btn:hover{color:#A78BFA!important}
    .upload-zone:hover{border-color:rgba(124,58,237,0.5)!important}
  `;

  // HERO
  if (phase === "hero") return (
    <div style={{ minHeight: "100vh", background: "#060816", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "'Courier New',monospace" }}>
      <style>{css}</style>
      <NeuralCanvas threatLevel={0.08} />
      <div style={{ position: "absolute", top: "8%", left: "8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.16),transparent 70%)", filter: "blur(50px)", animation: "glow 5s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", right: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%)", filter: "blur(50px)", animation: "glow 7s ease-in-out infinite reverse", pointerEvents: "none" }} />

      {/* topbar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 36px", zIndex: 50, borderBottom: "1px solid rgba(124,58,237,0.1)", background: "rgba(6,8,22,0.6)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7C3AED", boxShadow: "0 0 10px #7C3AED", animation: "pulse 1.8s infinite" }} />
          <span style={{ color: "#E5E7EB", fontSize: 13, letterSpacing: "0.22em", fontWeight: 700 }}>AEGIS<span style={{ color: "#7C3AED" }}>X</span></span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["THREAT INTEL", "DOCS", "STATUS"].map(l => <span key={l} style={{ color: "#4B5563", fontSize: 10, letterSpacing: "0.16em", cursor: "pointer" }}>{l}</span>)}
          <span style={{ padding: "5px 12px", border: "1px solid rgba(6,182,212,0.35)", color: "#06B6D4", fontSize: 10, letterSpacing: "0.14em", cursor: "pointer" }}>API ACCESS</span>
        </div>
      </div>

      {/* hero core */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 44, animation: "fadeUp 0.9s 0.2s ease both", opacity: 0 }}>
          <StatusBadge status="idle" />
          <span style={{ color: "#2D3748", fontSize: 11 }}>|</span>
          <span style={{ color: "#374151", fontSize: 10, letterSpacing: "0.16em" }}>NEURAL DEFENSE MATRIX v4.1.0</span>
        </div>

        <h1 style={{ fontSize: "clamp(64px,11vw,140px)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", marginBottom: 28, color: "#E5E7EB", animation: "fadeUp 0.9s 0.35s ease both", opacity: 0 }}>
          <GlitchText text="AEGIS" />
          <span style={{ color: "#7C3AED", textShadow: "0 0 40px rgba(124,58,237,0.8),0 0 80px rgba(124,58,237,0.35)" }}>X</span>
        </h1>

        <p style={{ fontSize: "clamp(15px,2vw,21px)", color: "#6B7280", letterSpacing: "0.08em", marginBottom: 16, animation: "fadeUp 0.9s 0.5s ease both", opacity: 0 }}>
          Trust what you hear.{" "}<span style={{ color: "#06B6D4" }}>Verify what you see.</span>
        </p>
        <p style={{ fontSize: 11, color: "#374151", letterSpacing: "0.22em", marginBottom: 56, animation: "fadeUp 0.9s 0.65s ease both", opacity: 0 }}>AI-POWERED DEEPFAKE & PHISHING DETECTION SYSTEM</p>

        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,72px)", marginBottom: 64, animation: "fadeUp 0.9s 0.8s ease both", opacity: 0 }}>
          {[{ l: "THREATS BLOCKED", v: "2.4M" }, { l: "ACCURACY", v: "99.3%" }, { l: "LATENCY", v: "<12ms" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#E5E7EB", letterSpacing: "-0.02em" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.22em", marginTop: 5 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <button className="btn-cta" onClick={() => setPhase("interface")} style={{
          position: "relative", overflow: "hidden", padding: "17px 50px",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", cursor: "pointer",
          border: "none", background: "linear-gradient(135deg,#7C3AED,#6D28D9)", color: "#E5E7EB",
          boxShadow: "0 0 40px rgba(124,58,237,0.45),0 0 80px rgba(124,58,237,0.18)",
          animation: "fadeUp 0.9s 0.95s ease both,float 3.5s 2.2s ease-in-out infinite", opacity: 0,
          fontFamily: "monospace", transition: "box-shadow 0.3s",
        }}>⬡ INITIALIZE SCAN SYSTEM</button>
      </div>

      {/* ticker */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(124,58,237,0.1)", background: "rgba(6,8,22,0.8)", padding: "9px 0", overflow: "hidden", zIndex: 50 }}>
        <div style={{ display: "flex", gap: 0, animation: "ticker 28s linear infinite", width: "max-content" }}>
          {["NEURAL SHIELD ACTIVE", "THREAT DB UPDATED 0.3s AGO", "1,247 NODES PROTECTED", "DEEPFAKE MODELS v7.2", "ZERO-DAY ALERTS 0", "NEURAL SHIELD ACTIVE", "THREAT DB UPDATED 0.3s AGO", "1,247 NODES PROTECTED", "DEEPFAKE MODELS v7.2", "ZERO-DAY ALERTS 0"].map((t, i) => (
            <span key={i} style={{ fontSize: 9, color: "#374151", letterSpacing: "0.2em", padding: "0 40px", whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // MAIN INTERFACE
  return (
    <div style={{ minHeight: "100vh", background: "#060816", fontFamily: "'Courier New',monospace", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>

      {/* ambient */}
      <div style={{ position: "fixed", top: "15%", left: "15%", width: 550, height: 550, borderRadius: "50%", background: `radial-gradient(circle,rgba(124,58,237,${0.04 + threatLevel * 0.09}),transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", transition: "all 1.4s", zIndex: 0, animation: "glow 6s ease-in-out infinite" }} />
      {threatLevel > 0.5 && <div style={{ position: "fixed", top: "30%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,rgba(255,77,109,${(threatLevel - 0.5) * 0.2}),transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0, transition: "all 1.4s" }} />}

      <NeuralCanvas threatLevel={threatLevel} />

      {/* TOPBAR */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 24px", zIndex: 100, borderBottom: "1px solid rgba(124,58,237,0.1)", background: "rgba(6,8,22,0.88)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }} onClick={() => { setPhase("hero"); setScanState("idle"); setResult(null); setThreatLevel(0.05); }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7C3AED", boxShadow: "0 0 9px #7C3AED", animation: "pulse 1.8s infinite" }} />
          <span style={{ color: "#E5E7EB", fontSize: 13, letterSpacing: "0.22em", fontWeight: 700 }}>AEGIS<span style={{ color: "#7C3AED" }}>X</span></span>
        </div>
        <StatusBadge status={scanState === "scanning" ? "scanning" : result ? result.result : "idle"} />
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#374151", letterSpacing: "0.18em" }}>NEURAL CORE ONLINE</span>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
            {[8, 12, 16, 10, 14].map((h, i) => <div key={i} style={{ width: 3, height: h, background: i < 4 ? "#7C3AED" : "#1F2937", borderRadius: 1 }} />)}
          </div>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", minHeight: "100vh", paddingTop: 52, position: "relative", zIndex: 10 }}>

        {/* LEFT */}
        <div style={{ padding: "28px 20px 28px 28px", display: "flex", flexDirection: "column", gap: 18, borderRight: "1px solid rgba(124,58,237,0.09)", overflowY: "auto" }}>

          {/* scan type */}
          <div>
            <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.28em", marginBottom: 10 }}>SELECT THREAT VECTOR</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {[{ id: "phishing", icon: "⬡", label: "PHISHING" }, { id: "audio", icon: "◈", label: "AUDIO" }, { id: "image", icon: "◉", label: "IMAGE" }].map(t => (
                <button key={t.id} className="type-btn" onClick={() => { setScanType(t.id); setScanState("idle"); setResult(null); setInputText(""); setFileName(null); setAudioActive(false); setThreatLevel(0.05); }} style={{
                  padding: "8px 15px", fontSize: 9, letterSpacing: "0.2em", cursor: "pointer",
                  background: scanType === t.id ? "rgba(124,58,237,0.16)" : "transparent",
                  border: `1px solid ${scanType === t.id ? "rgba(124,58,237,0.65)" : "rgba(255,255,255,0.07)"}`,
                  color: scanType === t.id ? "#A78BFA" : "#6B7280", fontFamily: "monospace",
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 12 }}>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* input */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.28em", marginBottom: 10 }}>
              {scanType === "phishing" ? "INPUT SUSPICIOUS CONTENT" : scanType === "audio" ? "AUDIO INPUT" : "VISUAL INPUT"}
            </div>

            {scanType === "phishing" && (
              <div style={{ position: "relative" }}>
                <ScanLine scanning={scanState === "scanning"} />
                <textarea value={inputText} onChange={e => setInputText(e.target.value)}
                  placeholder={"Paste suspicious email, message or URL here...\n\nTry: 'Urgent! Your account has been compromised. Click to verify NOW: secure-login.paypa1.xyz'"}
                  style={{ width: "100%", minHeight: 185, padding: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(124,58,237,0.18)", color: "#D1D5DB", fontSize: 12, lineHeight: 1.7, fontFamily: "monospace", transition: "border-color 0.3s" }}
                  onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.55)"}
                  onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.18)"} />
              </div>
            )}

            {(scanType === "audio" || scanType === "image") && (
              <div style={{ position: "relative" }}>
                <ScanLine scanning={scanState === "scanning"} />
                <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, border: `1px dashed ${fileName ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.09)"}`, background: fileName ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.01)", cursor: "pointer", transition: "all 0.3s", padding: 20 }}>
                  {fileName ? (
                    <><div style={{ fontSize: 26, color: "#7C3AED" }}>{scanType === "audio" ? "◈" : "◉"}</div>
                      <div style={{ color: "#A78BFA", fontSize: 11, letterSpacing: "0.1em" }}>{fileName}</div>
                      <div style={{ color: "#4B5563", fontSize: 9 }}>LOADED — READY TO ANALYZE</div></>
                  ) : (
                    <><div style={{ fontSize: 30, color: "#2D3748" }}>{scanType === "audio" ? "◈" : "◉"}</div>
                      <div style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.12em" }}>DROP {scanType === "audio" ? "AUDIO" : "IMAGE/VIDEO"} FILE</div>
                      <div style={{ color: "#374151", fontSize: 9 }}>OR CLICK TO BROWSE</div></>
                  )}
                </div>
                <input ref={fileRef} type="file" style={{ display: "none" }} accept={scanType === "audio" ? "audio/*" : "image/*,video/*"} onChange={e => setFileName(e.target.files?.[0]?.name || null)} />
              </div>
            )}

            {scanType === "audio" && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.24em", marginBottom: 7 }}>WAVEFORM MONITOR</div>
                <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(6,182,212,0.1)", padding: "6px 0" }}>
                  <WaveformBar active={audioActive || scanState === "scanning"} threatColor={result?.result === "threat" ? "255,77,109" : result?.result === "suspicious" ? "251,183,36" : undefined} />
                </div>
                <button onClick={() => setAudioActive(a => !a)} style={{ marginTop: 7, padding: "6px 14px", fontSize: 9, letterSpacing: "0.18em", background: audioActive ? "rgba(6,182,212,0.12)" : "transparent", border: "1px solid rgba(6,182,212,0.28)", color: "#06B6D4", cursor: "pointer", fontFamily: "monospace" }}>
                  {audioActive ? "■ STOP MONITOR" : "▶ SIMULATE INPUT"}
                </button>
              </div>
            )}
          </div>

          {/* presets */}
          {scanType === "phishing" && (
            <div>
              <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.26em", marginBottom: 8 }}>QUICK TEST SAMPLES</div>
              {[
                "URGENT: Your PayPal account is limited. Verify immediately: paypa1-secure.login.xyz/verify",
                "Meeting link for tomorrow: meet.google.com/abc-defg-hij — see you then!",
                "Your invoice #8821 is attached. Please review and confirm receipt before Friday.",
              ].map((s, i) => (
                <button key={i} className="sample-btn" onClick={() => setInputText(s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 11px", fontSize: 10, color: "#6B7280", background: "transparent", border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", letterSpacing: "0.05em", lineHeight: 1.55, marginBottom: 5, fontFamily: "monospace", transition: "all 0.2s" }}>
                  <span style={{ color: "#374151", marginRight: 7 }}>[{i + 1}]</span>{s.length > 75 ? s.slice(0, 72) + "..." : s}
                </button>
              ))}
            </div>
          )}

          {/* scan CTA */}
          <button className="btn-scan" onClick={handleScan} disabled={scanState === "scanning"} style={{
            width: "100%", padding: "14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.26em",
            cursor: scanState === "scanning" ? "not-allowed" : "pointer", border: "none",
            background: scanState === "scanning" ? "rgba(124,58,237,0.12)" : "linear-gradient(135deg,#7C3AED,#5B21B6)",
            color: scanState === "scanning" ? "#7C3AED" : "#E5E7EB",
            boxShadow: scanState === "scanning" ? "none" : "0 0 28px rgba(124,58,237,0.38)",
            transition: "all 0.3s", fontFamily: "monospace",
          }}>
            {scanState === "scanning" ? "⬡ ANALYZING THREAT VECTOR..." : "⬡ INITIATE SCAN"}
          </button>

          {/* feedback */}
          {result && scanState === "result" && (
            <div style={{ animation: "fadeUp 0.5s ease both" }}>
              <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.24em", marginBottom: 9 }}>REFINE NEURAL MODEL</div>
              {modelLearning ? (
                <div style={{ padding: 14, background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div style={{ fontSize: 10, color: "#7C3AED", letterSpacing: "0.18em", marginBottom: 7 }}>MODEL LEARNING...</div>
                  <div style={{ height: 2, background: "rgba(124,58,237,0.12)" }}>
                    <div style={{ height: "100%", background: "#7C3AED", animation: "learning 2.5s linear forwards", boxShadow: "0 0 7px #7C3AED" }} />
                  </div>
                  <div style={{ fontSize: 9, color: "#6B7280", marginTop: 7 }}>{modelLearning === "threat" ? "Reinforcing threat pattern signature..." : "Logging false positive for calibration..."}</div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 7 }}>
                  <button onClick={() => handleFeedback("threat")} style={{ flex: 1, padding: "9px", fontSize: 9, letterSpacing: "0.17em", background: "rgba(255,77,109,0.07)", border: "1px solid rgba(255,77,109,0.27)", color: "#FF4D6D", cursor: "pointer", fontFamily: "monospace" }}>✕ CONFIRM THREAT</button>
                  <button onClick={() => handleFeedback("false")} style={{ flex: 1, padding: "9px", fontSize: 9, letterSpacing: "0.17em", background: "rgba(6,212,114,0.07)", border: "1px solid rgba(6,212,114,0.27)", color: "#06D472", cursor: "pointer", fontFamily: "monospace" }}>✓ FALSE POSITIVE</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ padding: "28px 28px 28px 20px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

          {/* scan ring */}
          <div style={{ position: "relative" }}>
            <ScanRing scanning={scanState === "scanning"} result={result?.result} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none" }}>
              {scanState === "idle" && (
                <div style={{ fontSize: 10, color: "#2D3748", letterSpacing: "0.2em" }}>AWAITING<br /><span style={{ fontSize: 9 }}>INPUT</span></div>
              )}
              {scanState === "scanning" && (
                <TypedText text={["Analyzing...", "Pattern matching...", "Neural inference...", "Cross-ref DB..."][Math.floor(Date.now() / 900) % 4]} speed={34} style={{ fontSize: 10, color: "#374151", letterSpacing: "0.1em" }} />
              )}
              {scanState === "result" && result && (
                <>
                  <div style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 900, color: scanColor, textShadow: `0 0 20px ${scanColor}`, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {result.confidence.toFixed(1)}<span style={{ fontSize: "0.38em", fontWeight: 400 }}>%</span>
                  </div>
                  <div style={{ fontSize: 9, color: "#6B7280", marginTop: 4, letterSpacing: "0.18em" }}>CONFIDENCE</div>
                </>
              )}
            </div>
          </div>

          {/* result panel */}
          {scanState === "result" && result && (
            <div style={{ animation: "fadeUp 0.6s ease both", display: "flex", flexDirection: "column", gap: 14 }}>
              <StatusBadge status={result.result} />

              <div>
                <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.26em", marginBottom: 9 }}>CONFIDENCE BREAKDOWN</div>
                <ConfidenceBar value={result.confidence} label="Primary signal" color={scanColor} />
                <ConfidenceBar value={Math.min(99, result.confidence * 0.89 + rand(0, 4))} label="Pattern match" color={scanColor} />
                <ConfidenceBar value={Math.min(99, result.confidence * 0.73 + rand(0, 7))} label="Neural inference" color={scanColor} />
                <ConfidenceBar value={Math.min(99, result.confidence + rand(-4, 4))} label="Behavioral analysis" color={scanColor} />
              </div>

              {result.threats.length > 0 ? (
                <div>
                  <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.26em", marginBottom: 9 }}>DETECTED SIGNATURES</div>
                  {result.threats.map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", marginBottom: 5, background: "rgba(255,77,109,0.05)", border: "1px solid rgba(255,77,109,0.14)", animation: `fadeUp 0.4s ${i * 0.1}s ease both`, opacity: 0 }}>
                      <span style={{ color: "#FF4D6D", fontSize: 9 }}>▲</span>
                      <span style={{ color: "#D1D5DB", fontSize: 11 }}>{t}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "11px 14px", background: "rgba(6,212,114,0.05)", border: "1px solid rgba(6,212,114,0.14)" }}>
                  <div style={{ color: "#06D472", fontSize: 10, letterSpacing: "0.14em" }}>✓ NO SIGNATURES DETECTED</div>
                  <div style={{ color: "#4B5563", fontSize: 9, marginTop: 4 }}>Cleared across all detection layers</div>
                </div>
              )}
            </div>
          )}

          {scanState === "idle" && (
            <div style={{ color: "#1F2937", fontSize: 10, textAlign: "center", letterSpacing: "0.2em", padding: "8px 0" }}>CONFIGURE INPUT AND INITIATE SCAN</div>
          )}

          {/* threat map */}
          {history.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.26em", marginBottom: 7 }}>THREAT NODE MAP</div>
              <div style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(124,58,237,0.1)" }}>
                <ThreatNodes threats={history.map(h => ({ level: h.result.result, label: h.result.result.slice(0, 4).toUpperCase() }))} />
              </div>
            </div>
          )}

          {/* history */}
          {history.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: "#4B5563", letterSpacing: "0.26em", marginBottom: 7 }}>SCAN LOG</div>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", marginBottom: 4, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", animation: "fadeUp 0.3s ease both" }}>
                  <span style={{ fontSize: 10, color: "#6B7280", maxWidth: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.input}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.16em", color: h.result.result === "safe" ? "#06D472" : h.result.result === "threat" ? "#FF4D6D" : "#FBB724" }}>{h.result.result.toUpperCase()}</span>
                    <span style={{ fontSize: 9, color: "#374151" }}>{h.ts}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 24px", borderTop: "1px solid rgba(124,58,237,0.09)", background: "rgba(6,8,22,0.92)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {["MODEL GPT-SHIELD-7", "LATENCY 11ms", "ACCURACY 99.3%"].map(s => <span key={s} style={{ fontSize: 8, color: "#374151", letterSpacing: "0.2em" }}>{s}</span>)}
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <span style={{ fontSize: 8, color: "#374151", letterSpacing: "0.2em" }}>THREAT LEVEL</span>
          <div style={{ width: 72, height: 2, background: "rgba(255,255,255,0.05)" }}>
            <div style={{ height: "100%", width: `${threatLevel * 100}%`, background: threatLevel > 0.6 ? "#FF4D6D" : threatLevel > 0.3 ? "#7C3AED" : "#06D472", boxShadow: `0 0 5px ${threatLevel > 0.6 ? "#FF4D6D" : "#7C3AED"}`, transition: "all 1.2s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}