// server/models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
