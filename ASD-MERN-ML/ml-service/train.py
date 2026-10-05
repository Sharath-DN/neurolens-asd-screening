# Improved ASD Screening Model Training Script
# Includes class balancing, tuned hyperparameters, ROC-AUC, classification report
# Saves: preprocessor.pkl, xgb.pkl, lr.pkl, rf.pkl, weights.pkl, metrics.pkl

import numpy as np, pandas as pd, joblib, os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

os.makedirs('models', exist_ok=True)

rng = np.random.default_rng(42)
N = 3000

# ------------------------------------------------------
# 1. Generate synthetic dataset (improved realism)
# ------------------------------------------------------

# ------------------------------------------------------
# 1. Load Dataset
# ------------------------------------------------------

df = pd.read_csv("D:\ASD-MERN-ML - Copy1\ASD-MERN-ML\ml-service\Autism_Screening_Data_Combined.csv")

# Rename columns

df = df.rename(columns={
    "Age": "age",
    "Jauundice": "jaundice",
    "Family_ASD": "family_history"
})

# Convert Sex

df["gender"] = df["Sex"].map({
    "m": 1,
    "f": 0
})

# Convert yes/no columns

df["jaundice"] = df["jaundice"].map({
    "yes": 1,
    "no": 0
})

df["family_history"] = df["family_history"].map({
    "yes": 1,
    "no": 0
})

# Convert target

df["y"] = df["Class"].map({
    "YES": 1,
    "NO": 0
})

# Keep only required columns

cols = [
    "age",
    "gender",
    "jaundice",
    "family_history",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10"
]

df = df[cols + ["y"]]

# Remove missing values

df = df.dropna()

# Convert everything to integer

df = df.astype(int)

# Count imbalance for XGBoost weighting
asd_count = df['y'].sum()
non_asd_count = len(df) - asd_count
scale_pos = non_asd_count / asd_count

# ------------------------------------------------------
# 2. Split & Preprocessing
# ------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    df[cols], df['y'], test_size=0.2, random_state=7, stratify=df['y']
)

num_ix = list(range(X_train.shape[1]))
ct = ColumnTransformer([('num', StandardScaler(), num_ix)], remainder='drop')

ct.fit(X_train)
Xtr = ct.transform(X_train)
Xte = ct.transform(X_test)

# ------------------------------------------------------
# 3. Models with improved hyperparameters + class balance
# ------------------------------------------------------

models = {
    'xgb': XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_lambda=1.2,
        scale_pos_weight=scale_pos,
        eval_metric='logloss',
        random_state=7
    ),

    'lr': LogisticRegression(
        max_iter=400,
        solver='lbfgs',
        class_weight='balanced'
    ),

    'rf': RandomForestClassifier(
        n_estimators=250,
        max_depth=8,
        class_weight='balanced',
        random_state=7
    )
}

fits, accs = {}, {}
metrics = {}

# ------------------------------------------------------
# 4. Train & Evaluate Each Model
# ------------------------------------------------------

for k, m in models.items():
    print("\n" + "=" * 60)
    print(f"Training model: {k.upper()}")
    print("=" * 60)

    m.fit(Xtr, y_train)

    y_pred = m.predict(Xte)
    y_proba = m.predict_proba(Xte)[:, 1]

    # Accuracy
    acc = accuracy_score(y_test, y_pred)
    accs[k] = float(acc)

    # ROC-AUC
    roc_auc = roc_auc_score(y_test, y_proba)

    # Full classification report
    report_text = classification_report(
        y_test, y_pred, target_names=["Non-ASD", "ASD"]
    )
    report_dict = classification_report(
        y_test, y_pred, target_names=["Non-ASD", "ASD"], output_dict=True
    )

    fits[k] = m

    metrics[k] = {
        "accuracy": float(acc),
        "roc_auc": float(roc_auc),

        "precision_non_asd": float(report_dict["Non-ASD"]["precision"]),
        "recall_non_asd": float(report_dict["Non-ASD"]["recall"]),
        "f1_non_asd": float(report_dict["Non-ASD"]["f1-score"]),

        "precision_asd": float(report_dict["ASD"]["precision"]),
        "recall_asd": float(report_dict["ASD"]["recall"]),
        "f1_asd": float(report_dict["ASD"]["f1-score"]),

        "raw_report": report_text
    }

    print(f"\n{k.upper()} accuracy: {acc:.3f}")
    print(f"{k.upper()} ROC-AUC: {roc_auc:.3f}")
    print("\nClassification Report:\n")
    print(report_text)

# ------------------------------------------------------
# 5. Save Models
# ------------------------------------------------------

joblib.dump(ct, 'models/preprocessor.pkl')

for k, m in fits.items():
    joblib.dump(m, f'models/{k}.pkl')

# Accuracy only (backend uses this)
joblib.dump(accs, 'models/weights.pkl')

# Full evaluation metrics for your documentation
joblib.dump(metrics, 'models/metrics.pkl')

print("\n[OK] Models trained and saved to ./models")
