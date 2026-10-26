// PhishShield Content Script - Injects active security warnings on dangerous pages
(() => {
  const currentUrl = window.location.href;
  if (!currentUrl.startsWith("http")) return;

  fetch("http://localhost:8000/api/v1/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: currentUrl })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.risk_score >= 70 && !sessionStorage.getItem("phishshield_dismissed")) {
        showWarningBanner(data);
      }
    })
    .catch(() => {});

  function showWarningBanner(data) {
    const banner = document.createElement("div");
    banner.id = "phishshield-danger-banner";
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #7f1d1d;
      color: #ffffff;
      padding: 12px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      border-bottom: 2px solid #ef4444;
    `;

    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:20px;">🚨</span>
        <div>
          <strong style="color:#fecaca;">SECURITY WARNING: Suspected Phishing Website (${data.risk_score}/100 Risk Score)</strong>
          <div style="font-size:12px; color:#fca5a5;">${data.summary}</div>
        </div>
      </div>
      <button id="phishshield-dismiss-btn" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
      ">Dismiss</button>
    `;

    document.body.appendChild(banner);
    document.getElementById("phishshield-dismiss-btn").onclick = () => {
      banner.remove();
      sessionStorage.setItem("phishshield_dismissed", "true");
    };
  }
})();
