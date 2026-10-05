// server/src/routes/support.js
import express from "express";
import { auth } from "../middleware/auth.js";
import SupportTicket from "../models/SupportTicket.js";
import Doctor from "../models/Doctor.js";
import School from "../models/School.js";
import Video from "../models/Video.js";
import Game from "../models/Game.js";

const router = express.Router();

/**
 * PUBLIC RESOURCES for Support page
 * ---------------------------------
 * Used by client/src/pages/Support.jsx:
 *   GET /api/support/doctors
 *   GET /api/support/schools
 *   GET /api/support/videos
 *   GET /api/support/games
 */

router.get("/doctors", async (req, res) => {
  try {
    const docs = await Doctor.find().sort({ createdAt: -1 });
    return res.json(docs);
  } catch (e) {
    console.error("Public doctors fetch error:", e);
    return res.status(500).json({ message: "Could not fetch doctors" });
  }
});

router.get("/schools", async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    return res.json(schools);
  } catch (e) {
    console.error("Public schools fetch error:", e);
    return res.status(500).json({ message: "Could not fetch schools" });
  }
});

router.get("/videos", async (req, res) => {
  try {
    const vids = await Video.find().sort({ createdAt: -1 });
    return res.json(vids);
  } catch (e) {
    console.error("Public videos fetch error:", e);
    return res.status(500).json({ message: "Could not fetch videos" });
  }
});

router.get("/games", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    return res.json(games);
  } catch (e) {
    console.error("Public games fetch error:", e);
    return res.status(500).json({ message: "Could not fetch games" });
  }
});

/**
 * USER SUPPORT TICKETS
 * -------------------------------------------
 * These require user auth token from /api/auth/login.
 */

// Create ticket
router.post("/", auth, async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const ticket = await SupportTicket.create({
      userId: req.user.sub,
      subject,
      message,
    });
    return res.json(ticket);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not create ticket" });
  }
});

// List my tickets
router.get("/", auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.sub }).sort({
      createdAt: -1,
    });
    return res.json(tickets);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not fetch tickets" });
  }
});

// Update ticket status
router.patch("/:id", auth, async (req, res) => {
  const { status } = req.body;
  const ok = ["open", "in_progress", "closed"].includes(status);
  if (!ok) return res.status(400).json({ message: "Invalid status" });

  try {
    const t = await SupportTicket.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { status },
      { new: true }
    );
    if (!t) return res.status(404).json({ message: "Not found" });
    return res.json(t);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Could not update ticket" });
  }
});

export default router;
