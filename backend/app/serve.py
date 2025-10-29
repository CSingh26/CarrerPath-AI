from typing import List
from .schemas.io import StudentProfile, RoleResponse, RoleRecommendation
from .core.config import settings
from .features.build_features import featurize_profile
from .models.model_loader import load_model, predict_proba_with_labels

_model = None
_label_order = None

def _ensure_loaded():
    global _model, _label_order
    if _model is None:
        _model, _label_order = load_model(settings.MODEL_PATH)

def predict_top3(profile: StudentProfile) -> RoleResponse:
    _ensure_loaded()
    X = featurize_profile(profile)
    probs = predict_proba_with_labels(_model, X, _label_order)  # dict {label: prob}
    top3 = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)[:3]
    # naive placeholder for top features; SHAP later
    recs = [RoleRecommendation(role=r, score=float(p), top_features=[]) for r,p in top3]
    return RoleResponse(top3=recs)
