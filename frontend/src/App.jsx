import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import UrlScanner from "./components/UrlScanner";
import ThreatScoreGauge from "./components/ThreatScoreGauge";
import FeatureBreakdown from "./components/FeatureBreakdown";
import BatchScanner from "./components/BatchScanner";
import ModelBenchmarks from "./components/ModelBenchmarks";
import ThreatFeedSimulator from "./components/ThreatFeedSimulator";
import ExtensionPromo from "./components/ExtensionPromo";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [activeTab, setActiveTab] = useState("inspector");
  const [isOnline, setIsOnline] = useState(false);
  const [apiLatency, setApiLatency] = useState(0);

  // Inspector State
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Batch State
  const [batchResult, setBatchResult] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  // Models Info
  const [modelsInfo, setModelsInfo] = useState(null);

  // Check API status
  const checkHealth = async () => {
    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      if (res.ok) {
        setIsOnline(true);
        setApiLatency(Date.now() - start);
      } else {
        setIsOnline(false);
      }
    } catch (e) {
      setIsOnline(false);
    }
  };

  // Fetch model benchmarks
  const fetchModelsInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/models/info`);
      if (res.ok) {
        const data = await res.json();
        setModelsInfo(data);
      }
    } catch (e) {
      console.error("Could not fetch models info", e);
    }
  };

  // Single URL Scan
  const handleScanUrl = async (urlToScan) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToScan })
      });
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      setError(`Backend request failed: ${err.message}. Ensure FastAPI is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  // Batch Scan
  const handleBatchScan = async (urls) => {
    setBatchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/batch-predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls })
      });
      if (!res.ok) throw new Error("Batch triage error");
      const data = await res.json();
      setBatchResult(data);
    } catch (err) {
      alert(`Batch screening error: ${err.message}`);
    } finally {
      setBatchLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchModelsInfo();
    const interval = setInterval(checkHealth, 5000);

    // Initial default demo scan
    handleScanUrl("http://paypal-verification-account.security-center.xyz/login.php");

    return () => clearInterval(interval);
  }, []);

  const handleSelectThreatSample = (sampleUrl) => {
    setActiveTab("inspector");
    handleScanUrl(sampleUrl);
  };

  return (
    <div className="app-shell">
      <Header isOnline={isOnline} latency={apiLatency} />

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === "inspector" ? "active" : ""}`}
          onClick={() => setActiveTab("inspector")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Live URL Inspector
        </button>

        <button
          className={`tab-btn ${activeTab === "batch" ? "active" : ""}`}
          onClick={() => setActiveTab("batch")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Batch Threat Triage
        </button>

        <button
          className={`tab-btn ${activeTab === "benchmarks" ? "active" : ""}`}
          onClick={() => setActiveTab("benchmarks")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Model Benchmarks & NLP
        </button>

        <button
          className={`tab-btn ${activeTab === "sandbox" ? "active" : ""}`}
          onClick={() => setActiveTab("sandbox")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Threat Sandbox Matrix
        </button>

        <button
          className={`tab-btn ${activeTab === "extension" ? "active" : ""}`}
          onClick={() => setActiveTab("extension")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          Browser Extension
        </button>
      </nav>

      {/* Main Tab Content */}
      <main className="main-content">
        {activeTab === "inspector" && (
          <div>
            <UrlScanner onScan={handleScanUrl} loading={loading} />

            {error && (
              <div
                style={{
                  background: "rgba(255, 51, 102, 0.15)",
                  border: "1px solid #ff3366",
                  color: "#fecaca",
                  padding: "16px",
                  borderRadius: "10px",
                  marginBottom: "20px"
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {scanResult && (
              <div className="results-grid">
                <ThreatScoreGauge result={scanResult} />
                <FeatureBreakdown result={scanResult} />
              </div>
            )}
          </div>
        )}

        {activeTab === "batch" && (
          <BatchScanner
            onBatchScan={handleBatchScan}
            batchResult={batchResult}
            loading={batchLoading}
          />
        )}

        {activeTab === "benchmarks" && <ModelBenchmarks modelsInfo={modelsInfo} />}

        {activeTab === "sandbox" && (
          <ThreatFeedSimulator onSelectSample={handleSelectThreatSample} />
        )}

        {activeTab === "extension" && <ExtensionPromo />}
      </main>
    </div>
  );
}
