const API_BASE = "http://localhost:8000";

const targetUrlEl = document.getElementById("targetUrl");
const scanBtn = document.getElementById("scanBtn");
const loadingState = document.getElementById("loadingState");
const resultCard = document.getElementById("resultCard");
const errorState = document.getElementById("errorState");
const errorMsg = document.getElementById("errorMsg");
const apiStatusDot = document.getElementById("apiStatusDot");

const scoreCircle = document.getElementById("scoreCircle");
const riskScore = document.getElementById("riskScore");
const riskBadge = document.getElementById("riskBadge");
const confidenceText = document.getElementById("confidenceText");
const summaryText = document.getElementById("summaryText");
const indicatorsSection = document.getElementById("indicatorsSection");
const indicatorsList = document.getElementById("indicatorsList");

const entropyVal = document.getElementById("entropyVal");
const protocolVal = document.getElementById("protocolVal");
const ipVal = document.getElementById("ipVal");
const latencyVal = document.getElementById("latencyVal");

let currentActiveUrl = "";

// Check backend connectivity on open
async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: "GET" });
    if (res.ok) {
      apiStatusDot.classList.remove("offline");
      apiStatusDot.classList.add("online");
    } else {
      apiStatusDot.classList.add("offline");
    }
  } catch (err) {
    apiStatusDot.classList.add("offline");
  }
}

// Retrieve current active tab URL
async function initCurrentTab() {
  checkBackendHealth();
  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        currentActiveUrl = tabs[0].url;
        targetUrlEl.textContent = currentActiveUrl;
        
        // Auto-scan on popup open if http/https
        if (currentActiveUrl.startsWith("http://") || currentActiveUrl.startsWith("https://")) {
          analyzeUrl(currentActiveUrl);
        } else {
          targetUrlEl.textContent = currentActiveUrl + " (Internal/Special URL)";
        }
      } else {
        targetUrlEl.textContent = "https://www.google.com (Preview Mode)";
        currentActiveUrl = "https://www.google.com";
      }
    });
  } else {
    // Fallback in standalone testing
    currentActiveUrl = "http://paypal-verification-account.security-center.xyz/login.php";
    targetUrlEl.textContent = currentActiveUrl;
  }
}

async function analyzeUrl(url) {
  loadingState.classList.remove("hidden");
  resultCard.classList.add("hidden");
  errorState.classList.add("hidden");
  scanBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/v1/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url })
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: Failed to analyze URL`);
    }

    const data = await response.json();
    displayResults(data);
  } catch (err) {
    console.error("Scan error:", err);
    errorMsg.textContent = `Backend connection failed (${err.message}). Is FastAPI running at http://localhost:8000?`;
    errorState.classList.remove("hidden");
  } finally {
    loadingState.classList.add("hidden");
    scanBtn.disabled = false;
  }
}

function displayResults(data) {
  resultCard.classList.remove("hidden");
  
  // Risk Score & Badge
  const score = Math.round(data.risk_score);
  riskScore.textContent = score;
  confidenceText.textContent = `Confidence: ${(data.confidence * 100).toFixed(0)}%`;
  summaryText.textContent = data.summary;

  // Clear previous classes
  scoreCircle.className = "score-circle";
  riskBadge.className = "risk-badge";

  if (score >= 70) {
    scoreCircle.classList.add("danger");
    riskBadge.classList.add("danger");
    riskBadge.textContent = "DANGEROUS PHISHING";
  } else if (score >= 45) {
    scoreCircle.classList.add("suspicious");
    riskBadge.classList.add("suspicious");
    riskBadge.textContent = "SUSPICIOUS";
  } else if (score >= 20) {
    scoreCircle.classList.add("low");
    riskBadge.classList.add("low");
    riskBadge.textContent = "LOW RISK";
  } else {
    scoreCircle.classList.add("safe");
    riskBadge.classList.add("safe");
    riskBadge.textContent = "SAFE";
  }

  // Threat Indicators
  if (data.threat_indicators && data.threat_indicators.length > 0) {
    indicatorsSection.classList.remove("hidden");
    indicatorsList.innerHTML = "";
    data.threat_indicators.forEach((ti) => {
      const li = document.createElement("li");
      li.textContent = `[${ti.category}] ${ti.description}`;
      indicatorsList.appendChild(li);
    });
  } else {
    indicatorsSection.classList.add("hidden");
  }

  // Heuristics
  entropyVal.textContent = `${data.domain_entropy.toFixed(2)} bits`;
  protocolVal.textContent = data.has_https ? "HTTPS (TLS)" : "HTTP (Plain)";
  ipVal.textContent = data.has_ip ? "Yes (Alert)" : "Clean Host";
  latencyVal.textContent = `${data.latency_ms.toFixed(1)} ms`;

  // Update badge on chrome icon if available
  if (typeof chrome !== "undefined" && chrome.action && chrome.action.setBadgeText) {
    chrome.action.setBadgeText({ text: score >= 70 ? "!" : "OK" });
    chrome.action.setBadgeBackgroundColor({ color: score >= 70 ? "#ef4444" : "#10b981" });
  }
}

scanBtn.addEventListener("click", () => {
  if (currentActiveUrl) {
    analyzeUrl(currentActiveUrl);
  }
});

document.addEventListener("DOMContentLoaded", initCurrentTab);
