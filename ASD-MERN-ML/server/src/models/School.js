// server/src/models/School.js
import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,
    contact: String, // e.g. email or contact person
    phone: String,   // phone number for call button
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
