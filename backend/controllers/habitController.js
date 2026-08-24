const mongoose = require("mongoose");
const Habit = require("../models/Habit");

// Helper to validate Mongo ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all habits for authenticated user
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    const today = new Date().toISOString().split("T")[0];
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = yesterdayObj.toISOString().split("T")[0];

    // Check day transitions and update streak/today states if needed
    for (const habit of habits) {
      let changed = false;

      // Reset completedToday if last completion was not today
      if (
        habit.completedToday &&
        habit.lastCompletedDate !== today
      ) {
        habit.completedToday = false;
        changed = true;
      }

      // Reset streak to 0 if a day was missed for daily habits
      if (
        habit.frequency === "Daily" &&
        habit.lastCompletedDate &&
        habit.lastCompletedDate !== today &&
        habit.lastCompletedDate !== yesterday
      ) {
        if (habit.streak > 0) {
          habit.streak = 0;
          changed = true;
        }
      }

      if (changed) {
        await habit.save();
      }
    }

    const updatedHabits = await Habit.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(updatedHabits);
  } catch (error) {
    console.error("GetHabits error:", error.message || error);
    res.status(500).json({
      message: "Failed to fetch habits"
    });
  }
};

// Get one habit by ID (user isolated)
const getHabitById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid habit ID format"
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found"
      });
    }

    res.json(habit);
  } catch (error) {
    console.error("GetHabitById error:", error.message || error);
    res.status(500).json({
      message: "Failed to fetch habit"
    });
  }
};

// Create habit
const createHabit = async (req, res) => {
  try {
    const { name, frequency, streak, completedToday } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Habit name is required"
      });
    }

    const habit = await Habit.create({
      name: name.trim(),
      frequency: frequency ? frequency.trim() : "Daily",
      streak: typeof streak === "number" ? streak : 0,
      completedToday: Boolean(completedToday),
      userId: req.userId
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error("CreateHabit error:", error.message || error);
    res.status(400).json({
      message: "Failed to create habit"
    });
  }
};

// Update habit
const updateHabit = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid habit ID format"
      });
    }

    const { name, frequency, streak, completedToday, lastCompletedDate, completedDates } = req.body;
    const updateData = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Habit name cannot be empty" });
      }
      updateData.name = name.trim();
    }
    if (frequency !== undefined) updateData.frequency = frequency.trim();
    if (streak !== undefined) updateData.streak = Number(streak) || 0;
    if (completedToday !== undefined) updateData.completedToday = Boolean(completedToday);
    if (lastCompletedDate !== undefined) updateData.lastCompletedDate = lastCompletedDate;
    if (completedDates !== undefined && Array.isArray(completedDates)) updateData.completedDates = completedDates;

    const habit = await Habit.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      updateData,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found"
      });
    }

    res.json(habit);
  } catch (error) {
    console.error("UpdateHabit error:", error.message || error);
    res.status(400).json({
      message: "Failed to update habit"
    });
  }
};

// Delete habit
const deleteHabit = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid habit ID format"
      });
    }

    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found"
      });
    }

    res.json({
      message: "Habit deleted successfully"
    });
  } catch (error) {
    console.error("DeleteHabit error:", error.message || error);
    res.status(500).json({
      message: "Failed to delete habit"
    });
  }
};

// Complete habit (updates streak and date history)
const completeHabit = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid habit ID format"
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found"
      });
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // Already completed today
    if (habit.lastCompletedDate === today) {
      return res.json(habit);
    }

    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = yesterdayObj.toISOString().split("T")[0];

    habit.completedToday = true;

    if (habit.lastCompletedDate === yesterday) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }

    habit.lastCompletedDate = today;

    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
    }

    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error("CompleteHabit error:", error.message || error);
    res.status(500).json({
      message: "Failed to complete habit"
    });
  }
};

module.exports = {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit
};