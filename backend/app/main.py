import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from app.schemas import (
    PredictRequest,
    PredictResponse,
    BatchPredictRequest,
    BatchPredictResponse,
    ModelsInfoResponse
)
from app.model import PhishingDetector

app = FastAPI(
    title="AI-Based Phishing Website Detection API",
    description="Cybersecurity intelligence API utilizing Scikit-learn, NLP heuristics, and DistilBERT representations for real-time malicious URL classification.",
    version="1.0.0"
)

# Enable CORS for React Frontend and Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize detector
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
detector = PhishingDetector(models_dir=MODELS_DIR)


@app.on_event("startup")
async def startup_event():
    # If models don't exist yet, run initial training or reload
    rf_path = os.path.join(MODELS_DIR, "phishing_rf_model.joblib")
    if not os.path.exists(rf_path):
        try:
            from train import train_and_evaluate
            train_and_evaluate(models_dir=MODELS_DIR)
        except Exception as e:
            print(f"Warning during initial train: {e}")
    detector.load_models()


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Phishing Detection Engine",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": detector.rf_model is not None,
        "models_directory": MODELS_DIR
    }


@app.post("/api/v1/predict", response_model=PredictResponse)
def predict_single_url(request: PredictRequest):
    if not request.url or not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    return detector.analyze_url(request.url)


@app.post("/api/v1/batch-predict", response_model=BatchPredictResponse)
def predict_batch_urls(request: BatchPredictRequest):
    if not request.urls:
        raise HTTPException(status_code=400, detail="URLs list cannot be empty")
    if len(request.urls) > 200:
        raise HTTPException(status_code=400, detail="Maximum 200 URLs allowed per batch request")
    return detector.analyze_batch(request.urls)


@app.get("/api/v1/models/info", response_model=ModelsInfoResponse)
def get_models_info():
    return detector.get_models_info()


@app.get("/api/v1/samples")
def get_test_samples():
    return {
        "safe_samples": [
            {
                "url": "https://www.paypal.com/signin",
                "label": "Legitimate PayPal Login",
                "expected": "Safe"
            },
            {
                "url": "https://github.com/torvalds/linux",
                "label": "GitHub Source Repository",
                "expected": "Safe"
            },
            {
                "url": "https://en.wikipedia.org/wiki/Phishing",
                "label": "Wikipedia Educational Article",
                "expected": "Safe"
            },
            {
                "url": "https://www.chase.com/personal/banking",
                "label": "Chase Personal Banking",
                "expected": "Safe"
            }
        ],
        "phishing_samples": [
            {
                "url": "http://paypal-verification-account.security-center.xyz/login.php",
                "label": "PayPal Credential Harvester (Suspicious TLD + Keywords)",
                "expected": "Dangerous Phishing"
            },
            {
                "url": "http://192.168.1.105/paypal/signin.php?token=92841",
                "label": "Raw IP Address Phishing Kit",
                "expected": "Dangerous Phishing"
            },
            {
                "url": "http://appleid.apple.com.manage-identity-check.icu/auth/login",
                "label": "Subdomain Brand Spoofing (Apple ID)",
                "expected": "Dangerous Phishing"
            },
            {
                "url": "http://netflix-billing-issue-update.club/renew/payment.php",
                "label": "Fake Billing Renewal Portal",
                "expected": "Dangerous Phishing"
            },
            {
                "url": "http://x82910fa-secure-portal.tk/auth?user=victim&pass=harvest",
                "label": "High-Entropy DGA Host (.tk)",
                "expected": "Dangerous Phishing"
            }
        ]
    }
