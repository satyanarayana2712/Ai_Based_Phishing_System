import React, { useState } from "react";

export default function UrlScanner({ onScan, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  };

  const handleQuickPick = (sampleUrl) => {
    setUrl(sampleUrl);
    onScan(sampleUrl);
  };

  return (
    <div className="cyber-card scanner-container">
      <h2 className="scanner-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Neural URL Threat Inspector
      </h2>
      <p className="scanner-desc">
        Enter any domain, IP or deep link to perform real-time ML classification, lexical entropy extraction, and brand spoofing triage.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="url-input-wrap">
            <span className="url-input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <input
              type="text"
              className="url-input"
              placeholder="e.g. http://paypal-verification.security-update.xyz/login.php or https://github.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-scan" disabled={loading || !url.trim()}>
            {loading ? (
              <>
                <div className="cyber-spinner"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Inspect URL</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Test Vectors */}
      <div className="quick-picks">
        <span className="qp-label">Quick Vectors:</span>
        <button
          className="qp-chip"
          onClick={() => handleQuickPick("https://www.paypal.com/signin")}
        >
          ✅ PayPal Genuine
        </button>
        <button
          className="qp-chip phish"
          onClick={() =>
            handleQuickPick("http://paypal-verification-account.security-center.xyz/login.php")
          }
        >
          🚨 PayPal Spoof (.xyz)
        </button>
        <button
          className="qp-chip phish"
          onClick={() => handleQuickPick("http://192.168.1.105/paypal/signin.php?token=92841")}
        >
          🚨 Raw IP Host Kit
        </button>
        <button
          className="qp-chip"
          onClick={() => handleQuickPick("https://en.wikipedia.org/wiki/Phishing")}
        >
          ✅ Wikipedia Legit
        </button>
        <button
          className="qp-chip phish"
          onClick={() =>
            handleQuickPick("http://appleid.apple.com.manage-identity-check.icu/auth/login")
          }
        >
          🚨 Subdomain Brand Phish
        </button>
      </div>
    </div>
  );
}
