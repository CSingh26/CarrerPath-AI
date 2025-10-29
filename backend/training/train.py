import numpy as np, joblib, os
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from lightgbm import LGBMClassifier

LABELS = ["Data Analyst", "Backend Engineer", "ML Engineer", "Product Manager"]

def make_dummy(n=400):
    X = np.random.rand(n,5)
    y = np.random.randint(0, len(LABELS), size=n)
    return X, y

def main():
    X, y = make_dummy()
    Xtr, Xte, ytr, yte = train_test_split(X,y,test_size=0.2,random_state=42)
    clf = LGBMClassifier(n_estimators=200, random_state=42)
    clf.fit(Xtr, ytr)
    score = clf.predict_proba(Xte)
    # Not strictly multi-class AUC; keep for sanity
    print("Trained. Shape:", X.shape, "Classes:", len(LABELS))
    os.makedirs("data/models", exist_ok=True)
    joblib.dump({"model": clf, "labels": LABELS}, "data/models/careerpath_lgb.pkl")
    print("Saved -> data/models/careerpath_lgb.pkl")

if __name__ == "__main__":
    main()
