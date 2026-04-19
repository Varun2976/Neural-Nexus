from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import json
import base64
import numpy as np
from models_schema import TextReq, URLReq, AudioReq

# Try to import ONNX runtime
try:
    import onnxruntime as ort
    ONNX_AVAILABLE = True
except ImportError:
    ONNX_AVAILABLE = False

app = FastAPI(title="Neural-Nexus Model Server")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Model sessions
distilbert_session = None
charcnn_session = None
aasist_session = None

def load_models():
    global distilbert_session, charcnn_session, aasist_session

    models_dir = "models"

    # Try to load DistilBERT for text
    try:
        if ONNX_AVAILABLE:
            distilbert_path = os.path.join(models_dir, "distilbert.onnx")
            if os.path.exists(distilbert_path):
                distilbert_session = ort.InferenceSession(distilbert_path)
                logger.info("[OK] DistilBERT model loaded")
            else:
                logger.info("[--] DistilBERT model not found - using stub")
        else:
            logger.info("[--] ONNX Runtime not available - using stub for DistilBERT")
    except Exception as e:
        logger.error(f"[ERR] Error loading DistilBERT: {e}")
        distilbert_session = None

    # Try to load CharCNN for URL
    try:
        if ONNX_AVAILABLE:
            charcnn_path = os.path.join(models_dir, "charcnn.onnx")
            if os.path.exists(charcnn_path):
                charcnn_session = ort.InferenceSession(charcnn_path)
                logger.info("[OK] CharCNN model loaded")
            else:
                logger.info("[--] CharCNN model not found - using stub")
        else:
            logger.info("[--] ONNX Runtime not available - using stub for CharCNN")
    except Exception as e:
        logger.error(f"[ERR] Error loading CharCNN: {e}")
        charcnn_session = None

    # Try to load AASIST for audio
    try:
        if ONNX_AVAILABLE:
            aasist_path = os.path.join(models_dir, "aasist.onnx")
            if os.path.exists(aasist_path):
                aasist_session = ort.InferenceSession(aasist_path)
                logger.info("[OK] AASIST model loaded")
            else:
                logger.info("[--] AASIST model not found - using stub")
        else:
            logger.info("[--] ONNX Runtime not available - using stub for AASIST")
    except Exception as e:
        logger.error(f"[ERR] Error loading AASIST: {e}")
        aasist_session = None

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Neural-Nexus Model Server")
    load_models()
    logger.info("Model loading complete")

@app.post("/infer/text")
async def infer_text(req: TextReq):
    if distilbert_session is not None:
        # TODO: Implement actual ONNX inference
        risk_score = 0.5
    else:
        # Stub logic: keyword-based detection
        phishing_keywords = [
            "urgent", "verify", "otp", "click here", "won", "prize",
            "account suspended", "limited time", "confirm your",
            "wire transfer", "your account will be", "immediate action required"
        ]

        text_lower = req.text.lower()
        hits = sum(1 for keyword in phishing_keywords if keyword in text_lower)
        risk_score = min(hits / 4, 1.0)

    risk_score = round(risk_score, 3)

    if risk_score >= 0.75:
        label = "Phishing Detected"
        explanation = "Text contains indicators of phishing content"
    elif risk_score >= 0.4:
        label = "Suspicious"
        explanation = "Text contains some suspicious patterns"
    else:
        label = "Legitimate"
        explanation = "Text appears legitimate"

    return {
        "riskScore": risk_score,
        "label": label,
        "explanation": explanation
    }

@app.post("/infer/url")
async def infer_url(req: URLReq):
    if charcnn_session is not None:
        # TODO: Implement actual ONNX inference
        risk_score = 0.04
    else:
        # Stub logic: URL pattern detection
        phishing_urls = [
            "bit.ly", "tinyurl", "login-verify", "secure-update",
            "verify-now", "password-reset", "account-confirm",
            "banking-secure", "free-prize", "click-here", "update-required"
        ]

        url_lower = req.url.lower()
        risk_score = 0.88 if any(pattern in url_lower for pattern in phishing_urls) else 0.04

    risk_score = round(risk_score, 3)

    if risk_score >= 0.75:
        label = "Phishing URL"
        explanation = "URL matches known phishing patterns"
    else:
        label = "Legitimate URL"
        explanation = "URL appears safe"

    return {
        "riskScore": risk_score,
        "label": label,
        "explanation": explanation
    }

@app.post("/infer/audio")
async def infer_audio(req: AudioReq):
    if aasist_session is not None:
        # TODO: Implement actual ONNX inference with base64 audio
        risk_score = 0.08
    else:
        # Stub logic: just analyze audio length from base64
        try:
            audio_data = base64.b64decode(req.b64)
            audio_length = len(audio_data)
            # Very simple heuristic - could be refined
            risk_score = 0.08
        except Exception as e:
            logger.error(f"Error decoding audio: {e}")
            risk_score = 0.08

    risk_score = round(risk_score, 3)

    return {
        "riskScore": risk_score,
        "label": "Authentic",
        "explanation": "AASIST model not loaded -- stub response"
    }

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "models": {
            "text": "loaded" if distilbert_session is not None else "stub",
            "url": "loaded" if charcnn_session is not None else "stub",
            "audio": "loaded" if aasist_session is not None else "stub"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
