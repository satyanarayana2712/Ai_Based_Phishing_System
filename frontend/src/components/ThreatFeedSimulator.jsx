import React from "react";

export default function ThreatFeedSimulator({ onSelectSample }) {
  const attackVectors = [
    {
      category: "Brand Impersonation & Credential Harvesting",
      title: "PayPal Security Verification Spoof",
      url: "http://paypal-verification-account.security-center.xyz/login.php",
      severity: "High (Critical)",
      type: "Phishing",
      tags: ["Suspicious .xyz TLD", "Keyword: login", "Brand: paypal", "HTTP Insecure"]
    },
    {
      category: "Bare IP Infrastructure Attack",
      title: "Direct IP Hosted Banking Kit",
      url: "http://192.168.1.105/paypal/signin.php?token=92841",
      severity: "High (Critical)",
      type: "Phishing",
      tags: ["Raw IPv4 Host", "Hidden Domain", "Parameter Sniffer"]
    },
    {
      category: "Subdomain Deception",
      title: "Apple ID Identity Verification Phish",
      url: "http://appleid.apple.com.manage-identity-check.icu/auth/login",
      severity: "High (Critical)",
      type: "Phishing",
      tags: ["Subdomain Spoofing", "Apex .icu Domain", "OAuth Mimic"]
    },
    {
      category: "Subscription Billing Scam",
      title: "Netflix Billing Issue Renewal",
      url: "http://netflix-billing-issue-update.club/renew/payment.php",
      severity: "High (Critical)",
      type: "Phishing",
      tags: ["Keyword: payment", "Brand: netflix", ".club TLD"]
    },
    {
      category: "DGA & High Entropy Obfuscation",
      title: "Algorithmic DGA Host",
      url: "http://x82910fa-secure-portal.tk/auth?user=victim&pass=harvest",
      severity: "High (Critical)",
      type: "Phishing",
      tags: ["Shannon Entropy > 3.8", "Sensitive Query Params", ".tk Free TLD"]
    },
    {
      category: "Authentic Clean Domain",
      title: "Official PayPal Sign In",
      url: "https://www.paypal.com/signin",
      severity: "Clean",
      type: "Safe",
      tags: ["EV TLS Certificate", "Apex Domain", "Top 1000 Alexa"]
    },
    {
      category: "Open Source Tech Repository",
      title: "GitHub Linux Kernel",
      url: "https://github.com/torvalds/linux",
      severity: "Clean",
      type: "Safe",
      tags: ["Verified Identity", "Standard Path", "Reputable Host"]
    },
    {
      category: "Online Encyclopedia",
      title: "Wikipedia Cybersecurity Article",
      url: "https://en.wikipedia.org/wiki/Phishing",
      severity: "Clean",
      type: "Safe",
      tags: ["Educational", "Reputable Apex", "Valid HTTPS"]
    }
  ];

  return (
    <div className="cyber-card" style={{ padding: "28px" }}>
      <h3 className="card-title" style={{ marginBottom: "6px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
        </svg>
        Cyber Threat Sandbox & Live Vector Matrix
      </h3>
      <p className="scanner-desc">
        Click any attack vector or legitimate control sample below to load and run full neural analysis.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginTop: "16px"
        }}
      >
        {attackVectors.map((v, i) => {
          const isPhish = v.type === "Phishing";
          return (
            <div
              key={i}
              onClick={() => onSelectSample(v.url)}
              style={{
                background: "var(--bg-card-sub)",
                border: `1px solid ${isPhish ? "rgba(255, 51, 102, 0.25)" : "rgba(16, 185, 129, 0.25)"}`,
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isPhish ? "var(--color-danger)" : "var(--color-safe)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isPhish ? "rgba(255, 51, 102, 0.25)" : "rgba(16, 185, 129, 0.25)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
                  {v.category}
                </span>
                <span className={`ft-pill ${isPhish ? "danger" : "safe"}`}>
                  {v.type}
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-main)" }}>
                {v.title}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: isPhish ? "#fca5a5" : "var(--cyan-neon)",
                  wordBreak: "break-all",
                  background: "rgba(0, 0, 0, 0.3)",
                  padding: "6px 8px",
                  borderRadius: "6px"
                }}
              >
                {v.url}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {v.tags.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "10px",
                      background: "rgba(255, 255, 255, 0.05)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      color: "var(--text-muted)"
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: "11px", color: "var(--cyan-neon)", marginTop: "auto", fontWeight: 600 }}>
                Analyze Vector &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
