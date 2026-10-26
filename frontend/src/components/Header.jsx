import React from "react";

export default function Header({ isOnline, latency }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-wrapper">
          <div className="brand-shield">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="brand-text">
            <h1>PhishShield AI</h1>
            <div className="brand-tagline">AI-BASED MALICIOUS URL & PHISHING DETECTION PLATFORM</div>
          </div>
        </div>

        <div className="header-badges">
          <div className="model-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>DistilBERT + RF Ensemble</span>
          </div>

          <div className="status-chip">
            <span className={`status-dot ${isOnline ? "active" : "inactive"}`}></span>
            <span>{isOnline ? `API Live (${latency}ms)` : "API Offline"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
