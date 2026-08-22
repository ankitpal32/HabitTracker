const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit
} = require("../controllers/habitController");

const router = express.Router();

router.get("/", protect, getHabits);

router.get("/:id", protect, getHabitById);

router.post("/", protect, createHabit);

router.put("/:id", protect, updateHabit);

router.put("/:id/complete", protect, completeHabit);

router.delete("/:id", protect, deleteHabit);

module.exports = router;
