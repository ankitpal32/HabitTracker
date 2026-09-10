const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const habitRoutes = require("./routes/habitRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

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
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, same-origin)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json());

// Database readiness middleware for DB-dependent routes
const ensureDbConnected = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error("Database connection middleware error:", error.message || error);
    return res.status(503).json({
      message: "Database connection unavailable. Please try again shortly."
    });
  }
};

// Health check endpoint
const handleHealthCheck = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "ok" : "degraded",
    backend: "running",
    database: isConnected ? "connected" : "disconnected",
    jwtConfigured: Boolean(process.env.JWT_SECRET),
    dbConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI)
  });
};

app.get("/api/health", handleHealthCheck);
app.get("/health", handleHealthCheck);
app.get("/api/health/db", handleHealthCheck);
app.get("/health/db", handleHealthCheck);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Habit Tracker API is running"
  });
});

// API routes - support both /api/... and direct mounts for flexible routing
app.use("/api/habits", ensureDbConnected, habitRoutes);
app.use("/habits", ensureDbConnected, habitRoutes);

app.use("/api/auth", ensureDbConnected, authRoutes);
app.use("/auth", ensureDbConnected, authRoutes);

// Server startup for local execution
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectDB().catch((err) => {
    console.error("DB connection error on startup:", err.message);
  });
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;