import React, { useState } from "react";

export default function BatchScanner({ onBatchScan, batchResult, loading }) {
  const [text, setText] = useState(
    `https://www.google.com
http://192.168.1.105/paypal/signin.php?token=92841
https://github.com/torvalds/linux
http://paypal-verification-account.security-center.xyz/login.php
https://en.wikipedia.org/wiki/Computer_security
http://apple-id-recovery-support-auth.top/verify/security
http://netflix-billing-issue-update.club/renew/payment.php
https://www.chase.com/personal/banking`
  );

  const handleRunBatch = () => {
    const urls = text
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    if (urls.length > 0) {
      onBatchScan(urls);
    }
  };

  const exportCSV = () => {
    if (!batchResult || !batchResult.results) return;
    const headers = "URL,Risk Score,Verdict,Domain,Has IP,Entropy\n";
    const rows = batchResult.results
      .map(
        (r) =>
          `"${r.url}",${r.risk_score},"${r.risk_level}","${r.domain}",${r.has_ip},${r.domain_entropy}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phishing_threat_triage_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="batch-container">
      <div className="cyber-card scanner-container">
        <h2 className="scanner-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Batch URL Threat Screening & SOC Triage
        </h2>
        <p className="scanner-desc">
          Paste a list of URLs (one per line) for automated bulk classification, entropy analysis, and risk scoring.
        </p>

        <textarea
          className="batch-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste URLs here, one per line..."
          disabled={loading}
        />

        <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
          <button className="btn-scan" onClick={handleRunBatch} disabled={loading}>
            {loading ? (
              <>
                <div className="cyber-spinner"></div>
                <span>Analyzing Batch...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Run Batch Threat Screening</span>
              </>
            )}
          </button>

          {batchResult && (
            <button
              onClick={exportCSV}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-glow)",
                color: "var(--cyan-neon)",
                borderRadius: "10px",
                padding: "0 18px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px"
              }}
            >
              📥 Export Triage Report (CSV)
            </button>
          )}
        </div>
      </div>

      {batchResult && batchResult.summary && (
        <>
          <div className="batch-stats-grid">
            <div className="stat-box">
              <span className="stat-title">Total URLs</span>
              <span className="stat-num">{batchResult.summary.total_analyzed}</span>
            </div>
            <div className="stat-box" style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}>
              <span className="stat-title" style={{ color: "var(--color-safe)" }}>Verified Safe</span>
              <span className="stat-num" style={{ color: "var(--color-safe)" }}>
                {batchResult.summary.safe_count + batchResult.summary.low_risk_count}
              </span>
            </div>
            <div className="stat-box" style={{ borderColor: "rgba(245, 158, 11, 0.4)" }}>
              <span className="stat-title" style={{ color: "var(--color-suspicious)" }}>Suspicious</span>
              <span className="stat-num" style={{ color: "var(--color-suspicious)" }}>
                {batchResult.summary.suspicious_count}
              </span>
            </div>
            <div className="stat-box" style={{ borderColor: "rgba(255, 51, 102, 0.4)" }}>
              <span className="stat-title" style={{ color: "var(--color-danger)" }}>Dangerous Phishing</span>
              <span className="stat-num" style={{ color: "var(--color-danger)" }}>
                {batchResult.summary.dangerous_count}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-title">Avg Risk Index</span>
              <span className="stat-num">{batchResult.summary.average_risk_score}</span>
            </div>
          </div>

          <div className="cyber-card" style={{ padding: "20px" }}>
            <h3 className="card-title" style={{ marginBottom: "12px" }}>
              Detailed Batch Screening Results
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table className="batch-table">
                <thead>
                  <tr>
                    <th>TARGET URL</th>
                    <th>RISK LEVEL</th>
                    <th>SCORE</th>
                    <th>DOMAIN ENTROPY</th>
                    <th>PROTOCOL</th>
                    <th>FLAGS</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResult.results.map((r, idx) => (
                    <tr key={idx}>
                      <td className="url-cell" title={r.url}>{r.url}</td>
                      <td>
                        <span
                          className={`ft-pill ${
                            r.risk_score >= 70
                              ? "danger"
                              : r.risk_score >= 45
                              ? "suspicious"
                              : "safe"
                          }`}
                        >
                          {r.risk_level}
                        </span>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                        {r.risk_score}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>
                        {r.domain_entropy.toFixed(2)} bits
                      </td>
                      <td>{r.has_https ? "HTTPS" : "HTTP (Insecure)"}</td>
                      <td>
                        {r.threat_indicators && r.threat_indicators.length > 0 ? (
                          <span style={{ color: "#fca5a5", fontSize: "11px" }}>
                            {r.threat_indicators.length} threats found
                          </span>
                        ) : (
                          <span style={{ color: "var(--color-safe)", fontSize: "11px" }}>Clean</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
