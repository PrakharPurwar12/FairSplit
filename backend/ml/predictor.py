import logging
from pathlib import Path

import joblib
import pandas as pd

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "ml" / "models"

_model = None
_priority_encoder = None
_risk_encoder = None


def get_model_assets():
    global _model, _priority_encoder, _risk_encoder
    if _model is None or _priority_encoder is None or _risk_encoder is None:
        try:
            _model = joblib.load(MODEL_DIR / "risk_model.pkl")
            _priority_encoder = joblib.load(MODEL_DIR / "priority_encoder.pkl")
            _risk_encoder = joblib.load(MODEL_DIR / "risk_encoder.pkl")
        except Exception as e:
            logger.error(f"Failed to load ML risk prediction assets: {e}")
            raise RuntimeError(
                "ML Risk Prediction model assets are unavailable."
            ) from e
    return _model, _priority_encoder, _risk_encoder


def predict_risk(data):
    model, priority_encoder, risk_encoder = get_model_assets()

    priority = priority_encoder.transform([str(data["priority"]).lower()])[0]

    input_df = pd.DataFrame(
        [
            {
                "estimated_hours": data["estimated_hours"],
                "difficulty": data["difficulty"],
                "priority": priority,
                "required_skills": data["required_skills"],
                "skill_score": data["skill_score"],
                "workload_score": data["workload_score"],
                "active_tasks": data["active_tasks"],
                "days_left": data["days_left"],
                "completion_percentage": data["completion_percentage"],
            }
        ]
    )

    prediction = model.predict(input_df)[0]
    probabilities = model.predict_proba(input_df)[0]
    confidence = round(max(probabilities) * 100, 2)
    predicted_risk = risk_encoder.inverse_transform([prediction])[0]
    classes = risk_encoder.inverse_transform(list(range(len(probabilities))))

    risk_probabilities = {
        label: round(prob * 100, 2) for label, prob in zip(classes, probabilities)
    }

    return {
        "predicted_risk": predicted_risk,
        "confidence": confidence,
        "probabilities": risk_probabilities,
    }
