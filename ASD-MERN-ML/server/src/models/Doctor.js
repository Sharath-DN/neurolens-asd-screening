// server/models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: String,
    clinic: String,
    phone: String,
    email: String,
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
