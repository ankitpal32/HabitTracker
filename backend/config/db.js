const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "MongoDB connection error: MONGODB_URI or MONGO_URI is not defined in environment variables."
    );
  }

  if (!cached.promise) {
    const opts = {
      dbName: "HabitTracker",
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      bufferCommands: false
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log("MongoDB Atlas connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB Atlas connection failed: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

// Connection event listeners
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB Atlas disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB Atlas reconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB Atlas connection error: ${err.message}`);
});

module.exports = connectDB;