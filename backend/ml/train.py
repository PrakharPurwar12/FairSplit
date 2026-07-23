import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from pathlib import Path
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)



BASE_DIR = Path(__file__).resolve().parent.parent

DATASET = BASE_DIR / "datasets" / "FairSplit_AI_Risk_Dataset.xlsx"

df = pd.read_excel(DATASET)

priority_encoder = LabelEncoder()
risk_encoder = LabelEncoder()

df["priority"] = priority_encoder.fit_transform(df["priority"])
df["risk"] = risk_encoder.fit_transform(df["risk"])

X = df.drop(columns=["risk"])
y = df["risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Accuracy : {accuracy:.4f}")
print("Accuracy")
print(accuracy_score(y_test, predictions))

print(classification_report(y_test, predictions))

print(confusion_matrix(y_test, predictions))

joblib.dump(model, "ml/models/risk_model.pkl")
joblib.dump(priority_encoder, "ml/models/priority_encoder.pkl")
joblib.dump(risk_encoder, "ml/models/risk_encoder.pkl")

print("Model Saved Successfully")