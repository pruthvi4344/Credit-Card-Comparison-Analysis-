import { useState, useEffect } from 'react';

export default function Navbar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-logo-zone">
        <div className="navbar-hexagon">💳</div>
        <div className="navbar-brand-text">
          <div className="navbar-brand-title">CC_SEARCH</div>
          <div className="navbar-brand-sub">Engine v1.0</div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="navbar-status">
          <div className="status-dot" />
          <span>Backend: localhost:8080</span>
        </div>
        <span className="badge badge-green">LIVE</span>
        <div className="navbar-time">{time}</div>
      </div>
    </header>
  );
}