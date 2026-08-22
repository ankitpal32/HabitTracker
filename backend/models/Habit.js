const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    frequency: {
      type: String,
      required: true,
      trim: true
    },

    streak: {
      type: Number,
      default: 0
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

module.exports = mongoose.model("Habit", habitSchema);