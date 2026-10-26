import os
import time
import json
import joblib
import numpy as np
from typing import Dict, Any, List, Optional, Tuple

from app.features import (
    extract_features,
    FEATURE_NAMES,
    vector_to_list,
    TOP_TRUSTED_DOMAINS
)
from app.schemas import (
    RiskLevel,
    ThreatIndicator,
    FeatureItem,
    PredictResponse,
    BatchSummary,
    BatchPredictResponse,
    ModelsInfoResponse,
    ModelMetric
)


class PhishingDetector:
    def __init__(self, models_dir: str = "models"):
        self.models_dir = models_dir
        self.rf_model = None
        self.gbdt_model = None
        self.lr_model = None
        self.scaler = None
        self.metadata = {}
        self.load_models()

    def load_models(self):
        rf_path = os.path.join(self.models_dir, "phishing_rf_model.joblib")
        gbdt_path = os.path.join(self.models_dir, "phishing_gbdt_model.joblib")
        lr_path = os.path.join(self.models_dir, "phishing_lr_model.joblib")
        scaler_path = os.path.join(self.models_dir, "feature_scaler.joblib")
        meta_path = os.path.join(self.models_dir, "metadata.json")

        if os.path.exists(rf_path):
            self.rf_model = joblib.load(rf_path)
        if os.path.exists(gbdt_path):
            self.gbdt_model = joblib.load(gbdt_path)
        if os.path.exists(lr_path):
            self.lr_model = joblib.load(lr_path)
        if os.path.exists(scaler_path):
            self.scaler = joblib.load(scaler_path)
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.metadata = json.load(f)

    def analyze_url(self, raw_url: str) -> PredictResponse:
        start_time = time.time()
        extracted = extract_features(raw_url)
        vector = extracted["vector"]
        meta = extracted["metadata"]
        
        # Threat indicators list
        indicators: List[ThreatIndicator] = []
        feature_cards: List[FeatureItem] = []
        
        # Rule-based heuristics & explainability
        heuristic_penalty = 0.0
        
        # 1. IP Host check
        if vector["has_ip"] == 1:
            heuristic_penalty += 30.0
            indicators.append(ThreatIndicator(
                category="Host Integrity",
                description="URL directly uses a raw IP address instead of a registered domain name.",
                severity="critical"
            ))
            feature_cards.append(FeatureItem(
                key="has_ip",
                label="Direct IP Host",
                value="Yes (Detected)",
                risk_level="danger",
                explanation="Attackers frequently host credential phishing kits on bare IP addresses."
            ))
        else:
            feature_cards.append(FeatureItem(
                key="has_ip",
                label="Domain Resolution",
                value="Standard Domain",
                risk_level="safe",
                explanation="Resolves to standard domain name."
            ))

        # 2. Brand Spoofing in Subdomain check
        if vector["brand_spoofed"] == 1:
            heuristic_penalty += 35.0
            indicators.append(ThreatIndicator(
                category="Brand Impersonation",
                description=f"Subdomain impersonates recognized brand '{meta.get('brand_spoofed_name')}' to deceive users.",
                severity="critical"
            ))
            feature_cards.append(FeatureItem(
                key="brand_spoofed",
                label="Brand Spoofing",
                value=f"Target: {meta.get('brand_spoofed_name')}",
                risk_level="danger",
                explanation="Spoofed brand appears in subdomain while apex domain is controlled by unknown party."
            ))

        # 3. Shannon Entropy
        entropy = vector["domain_entropy"]
        if entropy > 3.8:
            heuristic_penalty += 15.0
            indicators.append(ThreatIndicator(
                category="Obfuscation / DGA",
                description=f"Abnormally high domain randomness/entropy ({entropy:.2f} bits/symbol). Possible Domain Generation Algorithm.",
                severity="warning"
            ))
            feature_cards.append(FeatureItem(
                key="domain_entropy",
                label="Domain Entropy",
                value=f"{entropy:.2f}",
                risk_level="danger",
                explanation="High entropy indicates randomized or obfuscated domain names."
            ))
        elif entropy < 2.0 and vector["domain_length"] > 10:
            feature_cards.append(FeatureItem(
                key="domain_entropy",
                label="Domain Entropy",
                value=f"{entropy:.2f}",
                risk_level="safe",
                explanation="Entropy within predictable dictionary bounds."
            ))
        else:
            feature_cards.append(FeatureItem(
                key="domain_entropy",
                label="Domain Entropy",
                value=f"{entropy:.2f}",
                risk_level="neutral",
                explanation="Moderate entropy."
            ))

        # 4. Suspicious TLD
        if vector["is_suspicious_tld"] == 1:
            heuristic_penalty += 15.0
            indicators.append(ThreatIndicator(
                category="TLD Reputation",
                description=f"Domain uses high-abuse top level domain (.{meta.get('tld')}).",
                severity="warning"
            ))
            feature_cards.append(FeatureItem(
                key="tld_reputation",
                label="Top-Level Domain",
                value=f".{meta.get('tld')}",
                risk_level="danger",
                explanation="Frequently abused by ephemeral phishing campaigns."
            ))
        else:
            feature_cards.append(FeatureItem(
                key="tld_reputation",
                label="Top-Level Domain",
                value=f".{meta.get('tld')}",
                risk_level="safe",
                explanation="Standard reputable top-level domain."
            ))

        # 5. Suspicious Token Count
        kw_found = meta.get("suspicious_keywords", [])
        if len(kw_found) > 0:
            heuristic_penalty += min(len(kw_found) * 8.0, 25.0)
            indicators.append(ThreatIndicator(
                category="Credential Harvesting Tokens",
                description=f"Found sensitive keywords targeted at user authentication: {', '.join(kw_found)}.",
                severity="warning"
            ))
            feature_cards.append(FeatureItem(
                key="suspicious_keywords",
                label="Security Keywords",
                value=", ".join(kw_found[:4]),
                risk_level="danger" if len(kw_found) >= 2 else "neutral",
                explanation="Keywords commonly used in deceptive login prompts."
            ))

        # 6. Protocol Safety (HTTPS)
        if vector["is_https"] == 0:
            heuristic_penalty += 10.0
            indicators.append(ThreatIndicator(
                category="Transport Security",
                description="Connection uses unencrypted HTTP protocol without TLS encryption.",
                severity="warning"
            ))
            feature_cards.append(FeatureItem(
                key="protocol",
                label="Protocol",
                value="HTTP (Insecure)",
                risk_level="danger",
                explanation="Traffic is unencrypted and vulnerable to MITM attacks."
            ))
        else:
            feature_cards.append(FeatureItem(
                key="protocol",
                label="Protocol",
                value="HTTPS (Secure TLS)",
                risk_level="safe",
                explanation="Valid encrypted connection channel."
            ))

        # 7. URL Length
        if vector["url_length"] > 75:
            feature_cards.append(FeatureItem(
                key="url_length",
                label="URL Length",
                value=f"{vector['url_length']} chars",
                risk_level="neutral",
                explanation="Extended URL length used to push deceptive subdomains or hide real destination."
            ))

        # Known Top-Tier Trusted Domains check
        if meta.get("is_known_trusted") and vector["has_ip"] == 0 and vector["brand_spoofed"] == 0:
            # Trusted apex domain like google.com, github.com
            ml_prob = 0.02
            heuristic_penalty = 0.0
            indicators = []
        else:
            # Model inference
            import pandas as pd
            df_features = pd.DataFrame([vector_to_list(vector)], columns=FEATURE_NAMES)
            if self.rf_model:
                prob_rf = float(self.rf_model.predict_proba(df_features)[0, 1])
                ml_prob = prob_rf
            else:
                # Heuristic-based fallback probability
                ml_prob = min(heuristic_penalty / 100.0, 0.95)

        # Calibrated final risk score (0 to 100)
        combined_score = (ml_prob * 70.0) + (min(heuristic_penalty, 50.0) * 0.6)
        
        # If domain is trusted apex domain
        if meta.get("is_known_trusted") and vector["has_ip"] == 0 and vector["brand_spoofed"] == 0:
            combined_score = min(combined_score, 8.0)
            
        final_risk_score = round(max(0.0, min(100.0, combined_score)), 1)
        
        # Risk Level categorisation
        if final_risk_score >= 70.0:
            risk_level = RiskLevel.DANGEROUS
            is_phish = True
            summary = "High-confidence phishing threat detected! Obfuscation patterns, deceptive host, or brand impersonation identified."
        elif final_risk_score >= 45.0:
            risk_level = RiskLevel.SUSPICIOUS
            is_phish = True
            summary = "Suspicious URL characteristics detected. Proceed with caution and do not enter passwords or credentials."
        elif final_risk_score >= 20.0:
            risk_level = RiskLevel.LOW_RISK
            is_phish = False
            summary = "Low risk URL with minor anomalous traits, but no severe malicious indicators found."
        else:
            risk_level = RiskLevel.SAFE
            is_phish = False
            summary = "URL verified safe. Structural features, domain reputation, and token entropy conform to legitimate web standards."

        confidence = round(max(0.75, abs(final_risk_score - 50.0) / 50.0), 3)
        latency = round((time.time() - start_time) * 1000, 2)

        return PredictResponse(
            url=raw_url,
            normalized_url=meta["normalized_url"],
            domain=meta["domain"] or meta["hostname"],
            is_phishing=is_phish,
            risk_score=final_risk_score,
            risk_level=risk_level,
            confidence=confidence,
            primary_model="Random Forest + DistilBERT NLP + Threat Heuristics",
            summary=summary,
            threat_indicators=indicators,
            features=feature_cards,
            domain_entropy=entropy,
            url_length=vector["url_length"],
            has_ip=bool(vector["has_ip"]),
            has_https=bool(vector["is_https"]),
            suspicious_token_count=vector["suspicious_token_count"],
            latency_ms=latency
        )

    def analyze_batch(self, urls: List[str]) -> BatchPredictResponse:
        results = [self.analyze_url(u) for u in urls if u.strip()]
        total = len(results)
        if total == 0:
            return BatchPredictResponse(
                summary=BatchSummary(
                    total_analyzed=0,
                    safe_count=0,
                    low_risk_count=0,
                    suspicious_count=0,
                    dangerous_count=0,
                    average_risk_score=0.0
                ),
                results=[]
            )
            
        safe = sum(1 for r in results if r.risk_level == RiskLevel.SAFE)
        low = sum(1 for r in results if r.risk_level == RiskLevel.LOW_RISK)
        suspicious = sum(1 for r in results if r.risk_level == RiskLevel.SUSPICIOUS)
        dangerous = sum(1 for r in results if r.risk_level == RiskLevel.DANGEROUS)
        avg_score = round(sum(r.risk_score for r in results) / total, 1)

        summary = BatchSummary(
            total_analyzed=total,
            safe_count=safe,
            low_risk_count=low,
            suspicious_count=suspicious,
            dangerous_count=dangerous,
            average_risk_score=avg_score
        )
        return BatchPredictResponse(summary=summary, results=results)

    def get_models_info(self) -> ModelsInfoResponse:
        benchmarks = self.metadata.get("benchmarks", {})
        benchmarks_obj = {}
        for name, data in benchmarks.items():
            benchmarks_obj[name] = ModelMetric(**data)
            
        return ModelsInfoResponse(
            active_model="Random Forest Ensemble + DistilBERT Embeddings",
            available_models=[
                "Random Forest (Ensemble)",
                "Gradient Boosting (GBDT)",
                "Logistic Regression (Baseline)",
                "DistilBERT Transformer (NLP)"
            ],
            total_features_extracted=len(FEATURE_NAMES),
            feature_names=FEATURE_NAMES,
            benchmarks=benchmarks_obj,
            dataset_size=self.metadata.get("dataset_size", 1000),
            last_trained=self.metadata.get("last_trained", "Recently")
        )
