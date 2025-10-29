import joblib
from typing import Any, List, Tuple

def load_model(path: str) -> Tuple[Any, List[str]]:
    obj = joblib.load(path)
    return obj["model"], obj["labels"]

def predict_proba_with_labels(model, X, labels):
    probs = model.predict_proba(X)[0]
    return {label: prob for label, prob in zip(labels, probs)}
