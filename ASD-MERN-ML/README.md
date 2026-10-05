# ASD-MERN-ML

Full-stack MERN project for Autism Spectrum Disorder screening with ML models (XGBoost, Logistic Regression, Random Forest).

## Stack
- **Client:** React + Vite (MERN frontend)
- **Server:** Node.js + Express + MongoDB + JWT
- **Support Module:** Users can create and track support tickets (replaces email module)
- **ML Service:** Python FastAPI service hosting trained models (XGBoost / Logistic Regression / Random Forest)

## Features
- Login / Signup
- Questionnaire (A1–A10 yes/no + Age + Gender + Jaundice + Family History)
- Predict API aggregates three models (weighted by validation accuracy)
- Save predictions to MongoDB
- Support tickets (create, list, update status)
- One-command dev startup with concurrently

---

## Prerequisites
- Node.js >= 18
- Python >= 3.10
- MongoDB running locally (or Atlas connection string)
- (Optional but recommended) virtualenv for Python

---

## Quick Start (Development)

### 1) Configure environment
Copy root `.env.example` to `.env` and fill values:
```
cp .env.example .env
```

### 2) Install and start ML service
```
cd ml-service
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

pip install -r requirements.txt
# Train synthetic example models (or replace with your dataset in train.py)
python train.py

# Start FastAPI ML service (default http://127.0.0.1:8000)
uvicorn main:app --reload
```

### 3) Install and start server + client
Open a second terminal at project root:
```
npm run setup
npm run dev
```
This launches:
- **server** on http://localhost:5000
- **client** on http://localhost:5173

> Ensure `ML_SERVICE_URL` in `.env` matches the FastAPI URL (default http://127.0.0.1:8000).

---

## Build
- Client: `cd client && npm run build`
- Server uses Nodemon in dev; in prod run `node src/index.js`
- ML-service: run with `uvicorn` or any ASGI server

---

## Dataset
This template trains on **synthetic data** by default for immediate run-ability.  
To use your dataset, edit `ml-service/train.py` under the `# TODO: load your real dataset` section. Expected input fields:
- `A1`..`A10` (0/1)
- `age` (years, int)
- `gender` (0=female,1=male)
- `jaundice` (0/1)
- `family_history` (0/1)

---

## Security
- Demo-level JWT secret & CORS rules. Replace in production.
- Do not expose ML or Mongo without proper auth.

---

## Credits
Question set aligns with A1–A10 style from project report. Replace/extend per your study needs.
