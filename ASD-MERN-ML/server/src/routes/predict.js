import express from 'express';
import fetch from 'node-fetch';
import { auth } from '../middleware/auth.js';
import Prediction from '../models/Prediction.js';
import { config } from '../config.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body; // expects fields A1..A10, age, gender, jaundice, family_history
    const r = await fetch(`${config.mlUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    // save
    const pred = await Prediction.create({
      userId: req.user.sub,
      input: payload,
      modelVotes: data.model_votes,
      combinedScore: data.combined_score,
      label: data.label
    });
    res.json({ id: pred._id, ...data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Prediction failed' });
  }
});

export default router;
