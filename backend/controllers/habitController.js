const Habit = require("../models/Habit");

// Get all habits
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.userId
    });

    const today = new Date().toISOString().split("T")[0];
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterday = yesterdayObj.toISOString().split("T")[0];

    for (const habit of habits) {
      let changed = false;

      if (
        habit.completedToday &&
        habit.lastCompletedDate !== today
      ) {
        habit.completedToday = false;
        changed = true;
      }

      if (
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
    });

    res.json(updatedHabits);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get one habit
const getHabitById = async (req, res) => {
  try {
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
    res.status(500).json({
      message: error.message
    });
  }
};

// Create habit
const createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({
      ...req.body,
      userId: req.userId
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Update habit
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      req.body,
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
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete habit
const deleteHabit = async (req, res) => {
  try {
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
    res.status(500).json({
      message: error.message
    });
  }
};

const completeHabit = async (req, res) => {
  try {
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
    res.status(500).json({
      message: error.message
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