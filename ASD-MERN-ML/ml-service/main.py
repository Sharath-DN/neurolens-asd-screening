from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
import joblib
import numpy as np

app = FastAPI()

# Load artifacts at startup
preproc = None
models = {}
weights = {}

def load_artifacts():
    global preproc, models, weights
    preproc = joblib.load('models/preprocessor.pkl')
    models['xgb'] = joblib.load('models/xgb.pkl')
    models['lr'] = joblib.load('models/lr.pkl')
    models['rf'] = joblib.load('models/rf.pkl')
    weights = joblib.load('models/weights.pkl')

class InputPayload(BaseModel):
    age: int
    gender: int
    jaundice: int
    family_history: int
    A1: int; A2: int; A3: int; A4: int; A5: int
    A6: int; A7: int; A8: int; A9: int; A10: int

@app.on_event('startup')
def _startup():
    load_artifacts()

@app.get('/')
def root():
    return {'ok': True, 'service': 'ASD ML FastAPI'}

@app.post('/predict')
def predict(p: InputPayload):
    x = np.array([[
        p.age, p.gender, p.jaundice, p.family_history,
        p.A1,p.A2,p.A3,p.A4,p.A5,p.A6,p.A7,p.A8,p.A9,p.A10
    ]], dtype=float)
    X = preproc.transform(x)
    model_votes = {}
    for name, m in models.items():
        proba = float(m.predict_proba(X)[0][1])
        model_votes[name] = proba
    # weighted average by validation accuracies
    denom = sum(weights.values()) or 1.0
    combined = sum(model_votes[k]*weights[k] for k in model_votes)/denom
    label = 1 if combined >= 0.6 else 0
    return {
        'label': label,
        'combined_score': combined,
        'model_votes': model_votes
    }
