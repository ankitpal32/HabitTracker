import { useEffect, useState } from "react";
import api from "../services/api";
import { FiZap, FiCheckCircle, FiBarChart2, FiActivity } from "react-icons/fi";
import { getHabitIcon } from "../utils/habitIcons";

function Progress() {
  const [habits, setHabits] = useState([]);
  const [range, setRange] = useState(7);
  const [loading, setLoading] = useState(true);

  /* Fetch habits */
  const getHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  /* Calculate core metrics */
  const completedToday = habits.filter((habit) => habit.completedToday).length;
  const totalHabits = habits.length;
  const todayProgress = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);
  const bestStreak = totalHabits === 0 ? 0 : Math.max(...habits.map((h) => Number(h.streak) || 0));
  const totalCompletions = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);

  /* Helper to get formatted ISO date */
  const getDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  /* Build activity chart data */
  const activityData = [];
  for (let i = range - 1; i >= 0; i--) {
    const dateStr = getDate(i);
    const dateObj = new Date(`${dateStr}T00:00:00`);
    const completedCount = habits.filter((h) => h.completedDates?.includes(dateStr)).length;
    const label =
      range === 7
        ? dateObj.toLocaleDateString("en-US", { weekday: "short" })
        : dateObj.toLocaleDateString("en-US", { day: "numeric" });

    activityData.push({
      date: dateStr,
      completed: completedCount,
      label,
      isToday: i === 0
    });
  }

  /* Completion percentage for each habit */
  const getHabitRate = (habit) => {
    const completedDates = habit.completedDates || [];
    if (completedDates.length === 0) return 0;

    let inRangeCount = 0;
    for (let i = 0; i < range; i++) {
      if (completedDates.includes(getDate(i))) inRangeCount++;
    }

    const isWeekly = habit.frequency && habit.frequency.toLowerCase() === "weekly";
    const expected = isWeekly ? Math.max(1, Math.round(range / 7)) : range;
    return Math.min(100, Math.round((inRangeCount / expected) * 100));
  };

  if (loading) {
    return (
      <div className="progress-view">
        <section className="view-header">
          <div className="header-meta">
            <span className="page-pretitle">ANALYTICS</span>
            <h1 className="page-title">Habit Progress & Insights</h1>
            <p className="page-subtitle">Loading your habit analytics...</p>
          </div>
        </section>
        <div className="empty-state-card">
          <div className="empty-icon"><FiActivity /></div>
          <h4>Loading progress...</h4>
          <p>Analyzing your habit performance and activity history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-view">

      {/* Page Header */}
      <section className="view-header">
        <div className="header-meta">
          <span className="page-pretitle">ANALYTICS</span>
          <h1 className="page-title">Habit Progress & Insights</h1>
          <p className="page-subtitle">
            Understand your daily momentum and habit consistency.
          </p>
        </div>
      </section>

      {/* 3 Metric Cards */}
      <section className="stats-grid three-col">
        <div className="stat-card progress-stat-card">
          <div className="stat-card-content">
            <div className="stat-card-header">
              <span className="stat-card-title">Today's Progress</span>
            </div>
            <strong className="stat-card-value">{todayProgress}%</strong>
            <span className="stat-card-desc">{completedToday} of {totalHabits} completed</span>
          </div>
          <div className="stat-progress-ring">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="18" className="ring-track" />
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
          <span className="stat-card-desc">Continuous active days</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Completions</span>
            <span className="stat-card-icon green"><FiCheckCircle /></span>
          </div>
          <strong className="stat-card-value">{totalCompletions}</strong>
          <span className="stat-card-desc">All-time check-ins</span>
        </div>
      </section>

      {/* Activity Timeline Chart (Wide Card) */}
      <section className="dashboard-section activity-chart-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">TIMELINE</span>
            <h3 className="section-title">Habit Activity</h3>
          </div>

          <div className="range-toggle-group">
            <button
              type="button"
              className={`range-tab-btn ${range === 7 ? "active" : ""}`}
              onClick={() => setRange(7)}
            >
              7 Days
            </button>
            <button
              type="button"
              className={`range-tab-btn ${range === 30 ? "active" : ""}`}
              onClick={() => setRange(30)}
            >
              30 Days
            </button>
          </div>
        </div>

        {totalHabits === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon"><FiBarChart2 /></div>
            <h4>No activity recorded</h4>
            <p>Create and complete habits to see your activity timeline here.</p>
          </div>
        ) : (
          <div className={`activity-bars-container ${range === 30 ? "month-mode" : "week-mode"}`}>
            {activityData.map((d) => {
              const maxVal = Math.max(1, totalHabits);
              const heightPct = Math.round((d.completed / maxVal) * 100);

              return (
                <div
                  key={d.date}
                  className={`activity-bar-col ${d.isToday ? "today" : ""}`}
                  title={`${d.completed} habit${d.completed === 1 ? "" : "s"} on ${d.date}`}
                >
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${d.completed > 0 ? "active" : "empty"}`}
                      style={{ height: `${heightPct === 0 ? 8 : heightPct}%` }}
                    />
                  </div>
                  <span className="bar-label">{d.label}</span>
                  <strong className="bar-val">{d.completed}</strong>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Habit Performance Section */}
      <section className="dashboard-section performance-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">PERFORMANCE</span>
            <h3 className="section-title">Habit Consistency Breakdown</h3>
          </div>
          <span className="section-badge">{range}-Day Window</span>
        </div>

        {habits.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon"><FiActivity /></div>
            <h4>No habits to measure</h4>
            <p>Your habit breakdown will appear here once you create habits.</p>
          </div>
        ) : (
          <div className="performance-cards-list">
            {habits.map((habit) => {
              const rate = getHabitRate(habit);
              const totalDone = habit.completedDates?.length || 0;

              return (
                <div key={habit._id} className="performance-row-card">
                  <div className="perf-left">
                    <div className="perf-icon-wrap">
                      {getHabitIcon(habit.name)}
                    </div>
                    <div className="perf-meta">
                      <h4 className="perf-name">{habit.name}</h4>
                      <span className="perf-freq">{habit.frequency}</span>
                    </div>
                  </div>

                  <div className="perf-center">
                    <div className="perf-bar-track">
                      <div
                        className="perf-bar-fill"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>

                  <div className="perf-right">
                    <div className="perf-stat">
                      <strong>{rate}%</strong>
                      <span>Consistency</span>
                    </div>
                    <div className="perf-stat">
                      <strong>🔥 {habit.streak || 0}</strong>
                      <span>Streak</span>
                    </div>
                    <div className="perf-stat">
                      <strong>{totalDone}</strong>
                      <span>Total Done</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Progress;