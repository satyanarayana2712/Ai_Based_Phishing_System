from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    SAFE = "Safe"
    LOW_RISK = "Low Risk"
    SUSPICIOUS = "Suspicious"
    DANGEROUS = "Dangerous Phishing"


class ThreatIndicator(BaseModel):
    category: str
    description: str
    severity: str  # "info", "warning", "critical"


class FeatureItem(BaseModel):
    key: str
    label: str
    value: Any
    risk_level: str  # "safe", "neutral", "danger"
    explanation: str


class PredictRequest(BaseModel):
    url: str = Field(..., description="The website URL to analyze")
    include_breakdown: bool = Field(True, description="Whether to include detailed feature and XAI breakdown")


class PredictResponse(BaseModel):
    url: str
    normalized_url: str
    domain: str
    is_phishing: bool
    risk_score: float = Field(..., description="Risk score from 0 (safest) to 100 (most malicious)")
    risk_level: RiskLevel
    confidence: float = Field(..., description="Confidence between 0.0 and 1.0")
    primary_model: str
    summary: str
    threat_indicators: List[ThreatIndicator]
    features: List[FeatureItem]
    domain_entropy: float
    url_length: int
    has_ip: bool
    has_https: bool
    suspicious_token_count: int
    latency_ms: float


class BatchPredictRequest(BaseModel):
    urls: List[str] = Field(..., description="List of URLs to analyze in batch")


class BatchSummary(BaseModel):
    total_analyzed: int
    safe_count: int
    low_risk_count: int
    suspicious_count: int
    dangerous_count: int
    average_risk_score: float


class BatchPredictResponse(BaseModel):
    summary: BatchSummary
    results: List[PredictResponse]


class ModelMetric(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    latency_avg_ms: float


class ModelsInfoResponse(BaseModel):
    active_model: str
    available_models: List[str]
    total_features_extracted: int
    feature_names: List[str]
    benchmarks: Dict[str, ModelMetric]
    dataset_size: int
    last_trained: str
