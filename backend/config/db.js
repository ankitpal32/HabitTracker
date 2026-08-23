const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "❌ MongoDB connection error: MONGODB_URI or MONGO_URI is not defined in your environment variables (.env)."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "HabitTracker",
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });

    console.log(`✅ MongoDB Atlas connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB Atlas disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB Atlas reconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB Atlas connection error: ${err.message}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB Atlas connection closed due to app termination (SIGINT).");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB Atlas connection closed due to app termination (SIGTERM).");
  process.exit(0);
});

module.exports = connectDB;