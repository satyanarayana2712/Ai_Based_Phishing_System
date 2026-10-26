import React from "react";

export default function ExtensionPromo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
      {/* Instructions & Features */}
      <div className="cyber-card" style={{ padding: "28px" }}>
        <h3 className="card-title" style={{ marginBottom: "6px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          PhishShield AI Browser Extension
        </h3>
        <p className="scanner-desc">
          Get real-time proactive protection on every website you visit. The extension continuously interrogates the active tab against our local AI engine.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div
              style={{
                background: "rgba(0, 243, 255, 0.15)",
                color: "var(--cyan-neon)",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "13px",
                flexShrink: 0
              }}
            >
              1
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>Open Extensions in Chrome/Brave/Edge</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Navigate to <code style={{ color: "var(--cyan-neon)", fontFamily: "var(--font-mono)" }}>chrome://extensions</code> or <code style={{ color: "var(--cyan-neon)", fontFamily: "var(--font-mono)" }}>edge://extensions</code>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div
              style={{
                background: "rgba(0, 243, 255, 0.15)",
                color: "var(--cyan-neon)",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "13px",
                flexShrink: 0
              }}
            >
              2
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>Enable Developer Mode</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Toggle the switch in the top-right corner to reveal developer actions.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div
              style={{
                background: "rgba(0, 243, 255, 0.15)",
                color: "var(--cyan-neon)",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "13px",
                flexShrink: 0
              }}
            >
              3
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>Load Unpacked Extension</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Click <strong>Load unpacked</strong> and select the directory:
                <div
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--cyan-neon)",
                    marginTop: "6px",
                    fontSize: "12px"
                  }}
                >
                  d:\ai_based Pishing website detection\extension
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Mockup Preview */}
      <div className="cyber-card" style={{ padding: "28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h4 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Live Extension Preview
        </h4>

        <div
          style={{
            width: "300px",
            background: "#0a0f1d",
            border: "1px solid rgba(0, 243, 255, 0.3)",
            borderRadius: "12px",
            boxShadow: "0 0 25px rgba(0, 243, 255, 0.2)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "20px", height: "20px", color: "var(--cyan-neon)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <strong style={{ fontSize: "13px", color: "#e6edfd" }}>PhishShield AI</strong>
            </div>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}></span>
          </div>

          <div style={{ background: "#11192e", padding: "8px", borderRadius: "6px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--cyan-neon)", wordBreak: "break-all" }}>
            http://paypal-verification.xyz/login
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #ff3366", background: "rgba(255,51,102,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#ff3366" }}>92</span>
            </div>
            <div>
              <span style={{ background: "rgba(255,51,102,0.2)", color: "#ff3366", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 800 }}>
                DANGEROUS PHISHING
              </span>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>Confidence: 99%</div>
            </div>
          </div>

          <div style={{ background: "rgba(255,51,102,0.1)", borderLeft: "3px solid #ff3366", padding: "6px", borderRadius: "4px", fontSize: "10px", color: "#fca5a5" }}>
            High-risk spoofing detected: Domain uses deceptive TLD (.xyz) with sensitive credential harvest token.
          </div>
        </div>
      </div>
    </div>
  );
}
