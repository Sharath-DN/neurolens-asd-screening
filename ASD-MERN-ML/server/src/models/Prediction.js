import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  input: { type: Object, required: true },
  modelVotes: { type: Object, required: true },
  combinedScore: { type: Number, required: true },
  label: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Prediction', predictionSchema);
