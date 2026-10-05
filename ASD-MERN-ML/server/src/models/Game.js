// server/src/models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },       // where the game is hosted
    description: { type: String },
    thumbnail: { type: String },                 // optional image URL
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
