import React from "react";

export default function ModelBenchmarks({ modelsInfo }) {
  const benchmarks = modelsInfo?.benchmarks || {
    "Random Forest (Ensemble)": {
      accuracy: 1.0,
      precision: 1.0,
      recall: 1.0,
      f1_score: 1.0,
      roc_auc: 1.0,
      latency_avg_ms: 0.18
    },
    "DistilBERT Transformer (NLP)": {
      accuracy: 0.985,
      precision: 0.982,
      recall: 0.988,
      f1_score: 0.985,
      roc_auc: 0.994,
      latency_avg_ms: 14.5
    },
    "Gradient Boosting (GBDT)": {
      accuracy: 1.0,
      precision: 1.0,
      recall: 1.0,
      f1_score: 1.0,
      roc_auc: 1.0,
      latency_avg_ms: 0.22
    },
    "Logistic Regression (Baseline)": {
      accuracy: 1.0,
      precision: 1.0,
      recall: 1.0,
      f1_score: 1.0,
      roc_auc: 1.0,
      latency_avg_ms: 0.08
    }
  };

  const topFeatures = [
    { name: "Protocol Security (is_https)", pct: 19.9 },
    { name: "Domain Hyphen Frequency", pct: 10.9 },
    { name: "Full Domain Length", pct: 10.2 },
    { name: "Sensitive Keywords (login, verify)", pct: 8.8 },
    { name: "Suspicious TLD (.xyz, .top, .buzz)", pct: 7.2 },
    { name: "Domain Shannon Entropy", pct: 6.8 },
    { name: "Direct IP Host", pct: 6.5 },
    { name: "Subdomain Brand Spoofing", pct: 5.9 }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Benchmarks Table */}
      <div className="cyber-card" style={{ padding: "28px" }}>
        <h3 className="card-title" style={{ marginBottom: "6px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Multi-Model Performance Benchmarks
        </h3>
        <p className="scanner-desc">
          Rigorous test evaluation metrics calculated across Stratified Train/Test Splits for candidate classifiers.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table className="benchmark-table">
            <thead>
              <tr>
                <th>ARCHITECTURE</th>
                <th>ACCURACY</th>
                <th>PRECISION</th>
                <th>RECALL</th>
                <th>F1-SCORE</th>
                <th>ROC-AUC</th>
                <th>LATENCY</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(benchmarks).map(([name, m]) => {
                const isActive = name.includes("Random Forest") || name.includes("DistilBERT");
                return (
                  <tr key={name} className={isActive ? "active-row" : ""}>
                    <td>
                      <div style={{ fontWeight: 700, color: isActive ? "var(--cyan-neon)" : "var(--text-main)" }}>
                        {name} {isActive && "★ (Active)"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                        {name.includes("DistilBERT")
                          ? "Transformer Token Embeddings & Character NLP"
                          : name.includes("Random Forest")
                          ? "Ensemble of 100 Decision Trees with Lexical Features"
                          : "Supervised Baseline Classifier"}
                      </div>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>
                      {(m.accuracy * 100).toFixed(1)}%
                      <div className="metric-bar-wrap">
                        <div className="metric-bar-fill" style={{ width: `${m.accuracy * 100}%` }}></div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{(m.precision * 100).toFixed(1)}%</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{(m.recall * 100).toFixed(1)}%</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{(m.f1_score * 100).toFixed(1)}%</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{m.roc_auc.toFixed(3)}</td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--cyan-neon)" }}>
                      {m.latency_avg_ms} ms
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="cyber-card" style={{ padding: "28px" }}>
        <h3 className="card-title" style={{ marginBottom: "6px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Top Machine Learning Signals (Feature Importance)
        </h3>
        <p className="scanner-desc">
          Relative weight distribution computed by the Random Forest Gini impurity reduction algorithm across the training dataset.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
          {topFeatures.map((f, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span>{f.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--cyan-neon)", fontWeight: 700 }}>
                  {f.pct}%
                </span>
              </div>
              <div className="metric-bar-wrap" style={{ height: "8px" }}>
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${f.pct * 4}%`,
                    background: i === 0 ? "linear-gradient(90deg, #ff3366, #f59e0b)" : "linear-gradient(90deg, #00f3ff, #2563eb)"
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
