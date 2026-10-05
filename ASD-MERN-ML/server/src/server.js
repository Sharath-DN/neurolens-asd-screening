// server/src/server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

import { MONGO_URI, JWT_SECRET, ML_SERVICE_URL } from "./config.js";

import Doctor from "./models/Doctor.js";
import School from "./models/School.js";
import Video from "./models/Video.js";
import Game from "./models/Game.js";

import authRouter from "./routes/auth.js";
import supportRouter from "./routes/support.js";

const app = express();


// ==================== MIDDLEWARE ====================

// --- middleware ---

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());


// ==================== DATABASE ====================

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo error:", err));


// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
  res.json({
    message: "Nurolens Backend Running",
  });
});


// ==================== AUTH ROUTES ====================

app.use("/api/auth", authRouter);


// ==================== SUPPORT ROUTES ====================

app.use("/api/support", supportRouter);


// ==================== ADMIN AUTH ====================

function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.admin = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


// ==================== ADMIN LOGIN ====================

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@gmail.com";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "adminpassword";


app.post("/api/admin/login", (req, res) => {

  try {

    const { email, password } = req.body;

    if (
      email.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (password !== ADMIN_PASSWORD) {

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.json({ token });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// ==================== DOCTORS ====================

app.get("/api/admin/doctors", authMiddleware, async (req, res) => {

  const docs = await Doctor.find().sort({
    createdAt: -1,
  });

  res.json(docs);
});


app.post("/api/admin/doctors", authMiddleware, async (req, res) => {

  try {

    const doctor = await Doctor.create(req.body);

    res.status(201).json(doctor);

  } catch {

    res.status(400).json({
      message: "Invalid doctor data",
    });
  }
});


app.put("/api/admin/doctors/:id", authMiddleware, async (req, res) => {

  try {

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!doctor) {

      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);

  } catch {

    res.status(400).json({
      message: "Update failed",
    });
  }
});


app.delete("/api/admin/doctors/:id", authMiddleware, async (req, res) => {

  await Doctor.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true,
  });
});


// ==================== SCHOOLS ====================

app.get("/api/admin/schools", authMiddleware, async (req, res) => {

  const schools = await School.find().sort({
    createdAt: -1,
  });

  res.json(schools);
});


app.post("/api/admin/schools", authMiddleware, async (req, res) => {

  try {

    const school = await School.create(req.body);

    res.status(201).json(school);

  } catch {

    res.status(400).json({
      message: "Invalid school data",
    });
  }
});


app.put("/api/admin/schools/:id", authMiddleware, async (req, res) => {

  try {

    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!school) {

      return res.status(404).json({
        message: "School not found",
      });
    }

    res.json(school);

  } catch {

    res.status(400).json({
      message: "Update failed",
    });
  }
});


app.delete("/api/admin/schools/:id", authMiddleware, async (req, res) => {

  await School.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true,
  });
});


// ==================== VIDEOS ====================

app.get("/api/admin/videos", authMiddleware, async (req, res) => {

  const videos = await Video.find().sort({
    createdAt: -1,
  });

  res.json(videos);
});


app.post("/api/admin/videos", authMiddleware, async (req, res) => {

  try {

    const video = await Video.create(req.body);

    res.status(201).json(video);

  } catch {

    res.status(400).json({
      message: "Invalid video data",
    });
  }
});


app.put("/api/admin/videos/:id", authMiddleware, async (req, res) => {

  try {

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!video) {

      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.json(video);

  } catch {

    res.status(400).json({
      message: "Update failed",
    });
  }
});


app.delete("/api/admin/videos/:id", authMiddleware, async (req, res) => {

  await Video.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true,
  });
});


// ==================== GAMES ====================

app.get("/api/admin/games", authMiddleware, async (req, res) => {

  const games = await Game.find().sort({
    createdAt: -1,
  });

  res.json(games);
});


app.post("/api/admin/games", authMiddleware, async (req, res) => {

  try {

    const game = await Game.create(req.body);

    res.status(201).json(game);

  } catch {

    res.status(400).json({
      message: "Invalid game data",
    });
  }
});


app.put("/api/admin/games/:id", authMiddleware, async (req, res) => {

  try {

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!game) {

      return res.status(404).json({
        message: "Game not found",
      });
    }

    res.json(game);

  } catch {

    res.status(400).json({
      message: "Update failed",
    });
  }
});


app.delete("/api/admin/games/:id", authMiddleware, async (req, res) => {

  await Game.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true,
  });
});


// ==================== ML PREDICTION ====================

app.post("/api/predict", async (req, res) => {

  try {

    const mlResponse = await fetch(
      `${ML_SERVICE_URL}/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(req.body),
      }
    );

    const data = await mlResponse.json();

    return res
      .status(mlResponse.status)
      .json(data);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message:
        "Prediction failed. Make sure ML service is running.",
    });
  }
});


// ==================== START SERVER ====================



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});