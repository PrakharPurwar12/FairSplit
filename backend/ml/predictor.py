import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "ml" / "models"

model = joblib.load(MODEL_DIR / "risk_model.pkl")
priority_encoder = joblib.load(MODEL_DIR / "priority_encoder.pkl")
risk_encoder = joblib.load(MODEL_DIR / "risk_encoder.pkl")


def predict_risk(data):

    priority = priority_encoder.transform(
        [data["priority"]]
    )[0]

    input_df = pd.DataFrame([{

        "estimated_hours": data["estimated_hours"],

        "difficulty": data["difficulty"],

        "priority": priority,

        "required_skills": data["required_skills"],

        "skill_score": data["skill_score"],

        "workload_score": data["workload_score"],

        "active_tasks": data["active_tasks"],

        "days_left": data["days_left"],

        "completion_percentage": data["completion_percentage"]

    }])

    prediction = model.predict(input_df)[0]

    probabilities = model.predict_proba(input_df)[0]

    confidence = round(max(probabilities) * 100, 2)

    predicted_risk = risk_encoder.inverse_transform(
        [prediction]
    )[0]
    
    classes = risk_encoder.inverse_transform(
        list(range(len(probabilities)))
    )

    risk_probabilities = {
        label: round(prob * 100, 2)
        for label, prob in zip(classes, probabilities)
    }

    return {
        "predicted_risk": predicted_risk,
        "confidence": confidence,
        "probabilities": risk_probabilities
    }