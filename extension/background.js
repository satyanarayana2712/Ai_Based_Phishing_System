// Chrome Extension Manifest V3 Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("PhishShield AI URL Risk Analyzer Extension Installed.");
});

// Listen for tab URL updates to update badge state dynamically
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    fetch("http://localhost:8000/api/v1/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tab.url })
    })
      .then((res) => res.json())
      .then((data) => {
        const score = data.risk_score || 0;
        if (score >= 70) {
          chrome.action.setBadgeText({ tabId, text: "WARN" });
          chrome.action.setBadgeBackgroundColor({ tabId, color: "#ef4444" });
        } else if (score >= 45) {
          chrome.action.setBadgeText({ tabId, text: "RISK" });
          chrome.action.setBadgeBackgroundColor({ tabId, color: "#f59e0b" });
        } else {
          chrome.action.setBadgeText({ tabId, text: "SAFE" });
          chrome.action.setBadgeBackgroundColor({ tabId, color: "#10b981" });
        }
      })
      .catch((err) => {
        // Backend offline or unreachable
        chrome.action.setBadgeText({ tabId, text: "" });
      });
  }
});
