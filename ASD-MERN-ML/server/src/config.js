// server/src/config.js

export const PORT = process.env.PORT || 5000;

export const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/nurolens";

export const JWT_SECRET =
  process.env.JWT_SECRET ||
  "nurolens_secret";

export const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ||
  "http://127.0.0.1:8000";