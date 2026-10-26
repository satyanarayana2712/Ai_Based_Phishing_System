import React from "react";

export default function ThreatScoreGauge({ result }) {
  if (!result) return null;

  const score = Math.round(result.risk_score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Score 0 to 100 maps to strokeDashoffset
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "#10b981"; // Safe
  let badgeClass = "safe";
  let statusText = "SAFE URL";

  if (score >= 70) {
    color = "#ff3366";
    badgeClass = "dangerous";
    statusText = "DANGEROUS PHISHING";
  } else if (score >= 45) {
    color = "#f59e0b";
    badgeClass = "suspicious";
    statusText = "SUSPICIOUS THREAT";
  } else if (score >= 20) {
    color = "#38bdf8";
    badgeClass = "low";
    statusText = "LOW RISK";
  }

  return (
    <div className="cyber-card score-card">
      <div className="gauge-svg-wrap">
        <svg width="220" height="220" viewBox="0 0 200 200">
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
          />
          {/* Animated Gauge Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{
              transition: "stroke-dashoffset 1s ease-out, stroke 0.4s ease",
              filter: `drop-shadow(0 0 10px ${color})`
            }}
          />
        </svg>

        <div className="gauge-inner-content">
          <span className="gauge-score-num" style={{ color: color }}>
            {score}
          </span>
          <span className="gauge-score-label">Risk Index / 100</span>
        </div>
      </div>

      <div className={`verdict-badge ${badgeClass}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {score >= 70 ? (
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" />
          ) : (
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          )}
        </svg>
        <span>{statusText}</span>
      </div>

      <div className="verdict-summary">
        {result.summary}
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
        <div>Confidence: <strong style={{ color: "var(--text-main)" }}>{(result.confidence * 100).toFixed(0)}%</strong></div>
        <div>Inference: <strong style={{ color: "var(--text-main)" }}>{result.latency_ms.toFixed(1)} ms</strong></div>
      </div>
    </div>
  );
}
