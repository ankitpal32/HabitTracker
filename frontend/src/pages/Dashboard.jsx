import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import {
  FiPlus,
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiZap,
  FiActivity,
  FiCheckCircle,
  FiCalendar,
  FiLayers,
  FiSearch
} from "react-icons/fi";
import { getHabitIcon } from "../utils/habitIcons";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState(
    () => localStorage.getItem("defaultFrequency") || "Daily"
  );
  const [editingHabit, setEditingHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
  };

  /* Get habits from API */
  const getHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  /* Save or update habit */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Habit name is required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingHabit) {
        const response = await api.put(`/habits/${editingHabit._id}`, {
          name: name.trim(),
          frequency
        });
        setHabits((prev) =>
          prev.map((h) => (h._id === editingHabit._id ? response.data : h))
        );
      } else {
        const response = await api.post("/habits", {
          name: name.trim(),
          frequency
        });
        setHabits((prev) => [response.data, ...prev]);
      }

      setName("");
      setFrequency(localStorage.getItem("defaultFrequency") || "Daily");
      setEditingHabit(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving habit:", error);
      setFormError(getErrorMessage(error, "Failed to save habit"));
    } finally {
      setSubmitting(false);
    }
  };

  /* Complete habit */
  const completeHabit = async (id) => {
    try {
      const response = await api.put(`/habits/${id}/complete`);
      setHabits((prev) =>
        prev.map((h) => (h._id === id ? response.data : h))
      );
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  /* Delete habit */
  const deleteHabit = async (id) => {
    const confirmDelete = localStorage.getItem("confirmDelete") !== "false";
    if (confirmDelete) {
      const shouldDelete = window.confirm("Are you sure you want to delete this habit?");
      if (!shouldDelete) return;
    }

    try {
      await api.delete(`/habits/${id}`);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  /* Open edit modal */
  const startEditing = (habit) => {
    setEditingHabit(habit);
    setName(habit.name);
    setFrequency(habit.frequency || "Daily");
    setFormError("");
    setShowModal(true);
  };

  /* Open create modal */
  const openCreateModal = () => {
    setEditingHabit(null);
    setName("");
    setFrequency(localStorage.getItem("defaultFrequency") || "Daily");
    setFormError("");
    setShowModal(true);
  };

  /* Calculate statistics */
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedToday).length;
  const todayProgress = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);
  const bestStreak = totalHabits === 0 ? 0 : Math.max(...habits.map((h) => Number(h.streak) || 0));

  /* Calculate weekly consistency (last 7 days) */
  const getWeeklyDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const count = habits.filter((h) => h.completedDates?.includes(dateStr)).length;
      days.push({
        date: dateStr,
        label: dayLabel,
        isToday: i === 0,
        count
      });
    }
    return days;
  };

  const weeklyDays = getWeeklyDays();

  /* Filter habits */
  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name.toLowerCase().includes(search.toLowerCase());
    let matchesFilter = true;
    if (filter === "Completed") matchesFilter = habit.completedToday;
    else if (filter === "Pending") matchesFilter = !habit.completedToday;
    else if (filter === "Daily" || filter === "Weekly") matchesFilter = habit.frequency === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-view">
      {/* 1. Compact Heading Row */}
      <section className="dashboard-header-row">
        <div className="header-meta">
          <span className="page-pretitle">OVERVIEW</span>
          <h1 className="page-title">
            {getGreeting()}, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="page-subtitle">
            {getFormattedDate()} &bull; Keep your routine moving forward today.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary add-habit-btn"
          onClick={openCreateModal}
        >
          <FiPlus />
          <span>Add Habit</span>
        </button>
      </section>

      {/* 2. Statistics Grid (4 cards) */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Habits</span>
            <span className="stat-card-icon violet"><FiLayers /></span>
          </div>
          <strong className="stat-card-value">{totalHabits}</strong>
          <span className="stat-card-desc">Active routines</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Completed Today</span>
            <span className="stat-card-icon green"><FiCheckCircle /></span>
          </div>
          <strong className="stat-card-value">{completedToday}</strong>
          <span className="stat-card-desc">of {totalHabits} finished</span>
        </div>

        <div className="stat-card progress-stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <span className="stat-card-title">Today's Progress</span>
            </div>
            <strong className="stat-card-value">{todayProgress}%</strong>
            <span className="stat-card-desc">Daily goal reached</span>
          </div>
          <div className="stat-progress-ring">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="18"
                className="ring-track"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                className="ring-fill"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={
                  2 * Math.PI * 18 - (todayProgress / 100) * (2 * Math.PI * 18)
                }
              />
            </svg>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Best Streak</span>
            <span className="stat-card-icon orange"><FiZap /></span>
          </div>
          <strong className="stat-card-value">{bestStreak}</strong>
          <span className="stat-card-desc">Days consistent</span>
        </div>
      </section>

      {/* 3. Weekly Consistency Calendar Grid */}
      <section className="dashboard-section consistency-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">ACTIVITY</span>
            <h3 className="section-title">Weekly Consistency</h3>
          </div>
          <span className="section-badge">{completedToday} completed today</span>
        </div>

        <div className="consistency-grid">
          {weeklyDays.map((day) => (
            <div
              key={day.date}
              className={`consistency-day-card ${day.isToday ? "is-today" : ""} ${
                day.count > 0 ? "has-activity" : "no-activity"
              }`}
              title={`${day.count} habit${day.count === 1 ? "" : "s"} on ${day.date}`}
            >
              <span className="day-name">{day.label}</span>
              <div className="day-indicator">
                {day.count > 0 ? (
                  <span className="day-count">{day.count}</span>
                ) : (
                  <span className="day-empty-dot">&bull;</span>
                )}
              </div>
              <span className="day-date-sub">{day.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Today's Habits List */}
      <section className="dashboard-section habits-section">
        <div className="habits-toolbar">
          <div className="habits-heading-area">
            <span className="section-pretitle">YOUR ROUTINE</span>
            <h2 className="section-title">Today's Habits</h2>
          </div>

          <div className="habits-controls">
            <div className="search-input-wrap">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-field"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Habits</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state-card">
            <div className="empty-icon"><FiActivity /></div>
            <h4>Loading your habits...</h4>
            <p>Fetching your latest routines.</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon"><FiCalendar /></div>
            <h4>{habits.length === 0 ? "No habits yet" : "No matching habits"}</h4>
            <p>
              {habits.length === 0
                ? "Start by adding your first daily or weekly habit."
                : "Try clearing your search or changing the filter."}
            </p>
            {habits.length === 0 && (
              <button
                type="button"
                className="btn-primary"
                onClick={openCreateModal}
              >
                <FiPlus /> Create First Habit
              </button>
            )}
          </div>
        ) : (
          <div className="habit-cards-grid">
            {filteredHabits.map((habit) => {
              const isCompleted = Boolean(habit.completedToday);
              const streakCount = Number(habit.streak) || 0;

              return (
                <div
                  key={habit._id}
                  className={`habit-card ${isCompleted ? "completed" : "pending"}`}
                >
                  <div className="habit-card-top">
                    <div className="habit-info-cluster">
                      <div className="habit-icon-wrap">
                        {getHabitIcon(habit.name)}
                      </div>
                      <div className="habit-title-wrap">
                        <h4 className="habit-name">{habit.name}</h4>
                        <span className="habit-freq-badge">{habit.frequency}</span>
                      </div>
                    </div>

                    <div className="habit-streak-badge" title={`${streakCount} day streak`}>
                      <FiZap className="streak-icon" />
                      <span>{streakCount}</span>
                    </div>
                  </div>

                  <div className="habit-progress-row">
                    <div className="progress-status-label">
                      <span>{isCompleted ? "Completed today" : "Pending completion"}</span>
                      <strong>{isCompleted ? "100%" : "0%"}</strong>
                    </div>
                    <div className="habit-progress-track">
                      <div
                        className="habit-progress-fill"
                        style={{ width: isCompleted ? "100%" : "0%" }}
                      />
                    </div>
                  </div>

                  <div className="habit-card-actions">
                    <div className="habit-secondary-actions">
                      <button
                        type="button"
                        className="btn-icon-action"
                        onClick={() => startEditing(habit)}
                        title="Edit habit"
                        aria-label="Edit habit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action danger"
                        onClick={() => deleteHabit(habit._id)}
                        title="Delete habit"
                        aria-label="Delete habit"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <button
                      type="button"
                      className={`btn-complete-action ${isCompleted ? "done" : "action"}`}
                      onClick={() => completeHabit(habit._id)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? (
                        <>
                          <FiCheck /> Done
                        </>
                      ) : (
                        <>
                          <FiCheckCircle /> Mark Complete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Add / Edit Habit Modal */}
      {showModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingHabit ? "Edit Habit" : "Create New Habit"}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Habit Name</label>
                <input
                  type="text"
                  placeholder="e.g. Read 20 pages, Morning Run"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              {formError && <div className="form-error-msg">{formError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingHabit
                    ? "Save Changes"
                    : "Create Habit"}
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