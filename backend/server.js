const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const habitRoutes = require("./routes/habitRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

// Allowed CORS origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());

// Database readiness check middleware for DB-dependent routes
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Service is temporarily unavailable. Please try again shortly."
    });
  }
  next();
};

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Habit Tracker API is running"
  });
});

// Health check endpoint
const handleHealthCheck = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "ok" : "degraded",
    backend: "running",
    database: isConnected ? "connected" : "disconnected"
  });
};

app.get("/api/health", handleHealthCheck);
app.get("/health", handleHealthCheck);

// API routes
app.use("/api/habits", checkDbConnection, habitRoutes);
app.use("/api/auth", checkDbConnection, authRoutes);

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});