import { useEffect, useState } from "react";
import api from "../services/api";
import { FiPlus, FiZap, FiLayers, FiCheckCircle } from "react-icons/fi";
import { getHabitIcon } from "../utils/habitIcons";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState(
    localStorage.getItem("defaultFrequency") || "Daily"
  );
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formError, setFormError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const getHabits = async () => {
    try {
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading habits:", error);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("Please enter a habit name.");
      return;
    }

    const habitData = {
      name: name.trim(),
      frequency,
      streak: Number(streak) || 0,
      completedToday
    };

    try {
      if (editingId) {
        const response = await api.put(`/habits/${editingId}`, habitData);
        setHabits((prev) =>
          prev.map((habit) => (habit._id === editingId ? response.data : habit))
        );
      } else {
        const response = await api.post("/habits", habitData);
        setHabits((prev) => [...prev, response.data]);
      }
      clearForm();
    } catch (error) {
      console.error("Error saving habit:", error);
      setFormError(
        error.response?.data?.message || "Something went wrong while saving the habit."
      );
    }
  };

  const editHabit = (habit) => {
    setName(habit.name || "");
    setFrequency(habit.frequency || "Daily");
    setStreak(habit.streak || 0);
    setCompletedToday(Boolean(habit.completedToday));
    setEditingId(habit._id);
    setShowForm(true);
  };

  const completeHabit = async (id) => {
    try {
      const response = await api.put(`/habits/${id}/complete`);
      setHabits((prev) =>
        prev.map((habit) => (habit._id === id ? response.data : habit))
      );
    } catch (error) {
      console.error("Error completing habit:", error);
      alert(error.response?.data?.message || "Could not complete the habit.");
    }
  };

  const deleteHabit = async (id) => {
    const confirmDelete = localStorage.getItem("confirmDelete") !== "false";
    if (confirmDelete && !window.confirm("Are you sure you want to delete this habit?")) {
      return;
    }

    try {
      await api.delete(`/habits/${id}`);
      setHabits((prev) => prev.filter((habit) => habit._id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert(error.response?.data?.message || "Could not delete the habit.");
    }
  };

  const clearForm = () => {
    setName("");
    setFrequency(localStorage.getItem("defaultFrequency") || "Daily");
    setStreak(0);
    setCompletedToday(false);
    setEditingId(null);
    setFormError("");
    setShowForm(false);
  };

  const completedCount = habits.filter((habit) => habit.completedToday).length;
  const progress = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);
  const bestStreak = habits.length === 0 ? 0 : Math.max(...habits.map((h) => Number(h.streak) || 0));

  const getLast7DaysCompletion = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
      const dayCompletedCount = habits.filter((h) => h.completedDates?.includes(dateString)).length;
      const total = habits.length;
      const pct = total > 0 ? (dayCompletedCount / total) * 100 : 0;

      days.push({
        dayLabel,
        dateString,
        pct,
        completedCount: dayCompletedCount,
        isToday: i === 0
      });
    }
    return days;
  };

  const weeklyActivity = getLast7DaysCompletion();

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && habit.completedToday === true) ||
      (filter === "Pending" && habit.completedToday === false) ||
      filter === habit.frequency;

    return matchesSearch && matchesFilter;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="page-label">OVERVIEW</p>
          <h1>{getGreeting()}, {user?.name || "User"}</h1>
          <p className="current-date-subtitle">{currentDateString}</p>
        </div>

        <button
          className="add-button"
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <FiPlus /> Add Habit
        </button>
      </div>

      <section className="overview">
        <div className="stat-card">
          <div className="stat-card-top">
            <span>Total Habits</span>
            <span className="stat-icon"><FiLayers /></span>
          </div>
          <strong className="stat-number">{habits.length}</strong>
          <span className="stat-description">Habits you are tracking</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Completed Today</span>
            <span className="stat-icon green"><FiCheckCircle /></span>
          </div>
          <strong className="stat-number">{completedCount}</strong>
          <span className="stat-description">Out of {habits.length} habits</span>
        </div>

        <div className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="stat-card-top" style={{ marginBottom: 6 }}>
              <span>Today's Progress</span>
            </div>
            <strong className="stat-number" style={{ margin: 0 }}>{progress}%</strong>
            <span className="stat-description">Completion rate</span>
          </div>
          <div className="circular-progress-wrap" style={{ position: "relative", width: 55, height: 55 }}>
            <svg width="55" height="55" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="27.5"
                cy="27.5"
                r="18"
                fill="transparent"
                stroke="var(--border)"
                strokeWidth="4"
              />
              <circle
                cx="27.5"
                cy="27.5"
                r="18"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={(2 * Math.PI * 18) - (progress / 100) * (2 * Math.PI * 18)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.35s ease" }}
              />
            </svg>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
              {progress}%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Best Streak</span>
            <span className="stat-icon orange"><FiZap /></span>
          </div>
          <strong className="stat-number">{bestStreak}</strong>
          <span className="stat-description">Days at your best</span>
        </div>
      </section>

      {habits.length > 0 && (
        <section className="weekly-consistency-section">
          <div className="weekly-consistency-card">
            <div className="weekly-card-top">
              <span>Weekly Consistency</span>
              <span>Last 7 Days</span>
            </div>
            <div className="weekly-bars-container">
              {weeklyActivity.map((day, idx) => (
                <div className={`weekly-bar-col ${day.isToday ? "today" : ""}`} key={idx}>
                  <span className="weekly-day-label">{day.dayLabel}</span>
                  <div className="weekly-bar-wrapper">
                    <div className="weekly-bar-fill" style={{ height: `${day.pct}%` }}></div>
                  </div>
                  <span className="weekly-day-count">{day.completedCount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="habits-section">
        {habits.length === 0 ? (
          <div className="empty-card" style={{ padding: "40px 20px" }}>
            <div className="empty-icon" style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", opacity: 0.7 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>No habits yet</h3>
            <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 13 }}>
              Start with one small habit today.
            </p>
            <button
              className="add-button"
              onClick={() => {
                clearForm();
                setShowForm(true);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "0 auto" }}
            >
              <FiPlus /> Add Habit
            </button>
          </div>
        ) : (
          <>
            <div className="section-heading-row">
              <div>
                <p className="page-label">YOUR ROUTINE</p>
                <h2>Today's Habits</h2>
              </div>

              <div className="habit-tools">
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="All">All habits</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </div>

            {filteredHabits.length === 0 ? (
              <div className="empty-card" style={{ padding: "30px 20px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700 }}>No matching habits</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
                  Try adjusting your search terms or filters.
                </p>
              </div>
            ) : (
              <div className="habit-list">
                {filteredHabits.map((habit) => {
                  const isDone = habit.completedToday;
                  return (
                    <article className="habit-card" key={habit._id}>
                      <div className="habit-card-row-top">
                        <div className="habit-title-area">
                          <div className="habit-icon">
                            {getHabitIcon(habit.name)}
                          </div>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                            {habit.name}
                          </h3>
                        </div>
                        <div className="streak">
                          🔥 {habit.streak || 0}
                        </div>
                      </div>

                      <div className="habit-card-row-second">
                        <span className="frequency">{habit.frequency}</span>
                      </div>

                      <div className="habit-card-row-third">
                        <span style={{ color: isDone ? "var(--green)" : "var(--muted)", fontWeight: 700 }}>
                          {isDone ? "Completed today" : "Still to do today"}
                        </span>
                        <span style={{ fontWeight: 700 }}>
                          {isDone ? "100%" : "0%"}
                        </span>
                      </div>

                      <div className="habit-progress">
                        <div className={isDone ? "filled" : ""}></div>
                      </div>

                      <div className="habit-footer">
                        <button
                          className="edit-button"
                          onClick={() => editHabit(habit)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteHabit(habit._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="complete-button"
                          disabled={isDone}
                          onClick={() => completeHabit(habit._id)}
                        >
                          {isDone ? "Completed" : "Complete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              clearForm();
            }
          }}
        >
          <div className="habit-modal">
            <div className="form-header">
              <div>
                <p className="page-label">HABIT</p>
                <h2>{editingId ? "Edit Habit" : "Create a Habit"}</h2>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={clearForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Habit name</label>
                <input
                  type="text"
                  placeholder="Example: Coding Practice"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFormError("");
                  }}
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    value={frequency}
                    onChange={(event) => setFrequency(event.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Starting streak</label>
                  <input
                    type="number"
                    min="0"
                    value={streak}
                    onChange={(event) => setStreak(event.target.value)}
                  />
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={completedToday}
                  onChange={(event) => setCompletedToday(event.target.checked)}
                />
                Completed today
              </label>

              {formError && (
                <div style={{ color: "var(--red)", fontSize: "13px", fontWeight: "600", marginBottom: "15px" }}>
                  {formError}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  {editingId ? "Save Changes" : "Create Habit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;