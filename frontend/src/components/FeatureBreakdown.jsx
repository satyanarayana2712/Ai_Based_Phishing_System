import React from "react";

export default function FeatureBreakdown({ result }) {
  if (!result) return null;

  return (
    <div className="cyber-card breakdown-card">
      <div className="breakdown-header">
        <h3 className="card-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Deep URL Heuristics & Explainability
        </h3>
        <span style={{ fontSize: "12px", color: "var(--cyan-neon)", fontFamily: "var(--font-mono)" }}>
          {result.features?.length || 0} Evaluated Signals
        </span>
      </div>

      {/* Critical Threat Indicators Alert Box */}
      {result.threat_indicators && result.threat_indicators.length > 0 && (
        <div className="threat-alert-box">
          <div className="alert-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Triggered Threat Signatures ({result.threat_indicators.length})
          </div>
          {result.threat_indicators.map((ind, i) => (
            <div key={i} className="threat-item">
              <span style={{ fontWeight: 700, color: "#fca5a5" }}>[{ind.category}]</span>
              <span>{ind.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Features Grid */}
      <div className="features-grid" style={{ marginTop: "18px" }}>
        {result.features &&
          result.features.map((ft) => (
            <div key={ft.key} className="feature-tile">
              <div className="ft-top">
                <span className="ft-label">{ft.label}</span>
                <span className={`ft-pill ${ft.risk_level}`}>{ft.risk_level}</span>
              </div>
              <div className="ft-val">{String(ft.value)}</div>
              <div className="ft-explain">{ft.explanation}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
