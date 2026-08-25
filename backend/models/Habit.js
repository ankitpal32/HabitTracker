const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true
    },

    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"]
    },

    frequency: {
      type: String,
      required: [true, "Frequency is required"],
      trim: true,
      default: "Daily"
    },

    streak: {
      type: Number,
      default: 0,
      min: [0, "Streak cannot be negative"]
    },

    completedToday: {
      type: Boolean,
      default: false
    },

    completedDates: {
      type: [String],
      default: []
    },

    lastCompletedDate: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// queries and performance
habitSchema.index({ userId: 1, createdAt: -1 });
habitSchema.index({ userId: 1, lastCompletedDate: 1 });

module.exports = mongoose.model("Habit", habitSchema);