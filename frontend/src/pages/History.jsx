import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiCheckSquare,
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiSearch
} from "react-icons/fi";
import { getHabitIcon } from "../utils/habitIcons";

function History() {
  const [habits, setHabits] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  /* Get habit history */
  const getHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  /* Flatten completion history */
  const history = [];
  habits.forEach((habit) => {
    const dates = habit.completedDates || [];
    dates.forEach((date) => {
      history.push({
        id: `${habit._id}-${date}`,
        habitId: habit._id,
        habitName: habit.name,
        frequency: habit.frequency,
        date
      });
    });
  });

  history.sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`));

  /* Filter by search and habit  */
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.habitName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || item.habitName === filter;
    return matchesSearch && matchesFilter;
  });

  /* Date formatting */
  const formatDate = (dateStr) => {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getDayLabel = (dateStr) => {
    const today = new Date();
    const date = new Date(`${dateStr}T00:00:00`);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return formatDate(dateStr);
  };

  /* Group by date */
  const groupedHistory = {};
  filteredHistory.forEach((item) => {
    if (!groupedHistory[item.date]) groupedHistory[item.date] = [];
    groupedHistory[item.date].push(item);
  });

  const historyDates = Object.keys(groupedHistory).sort(
    (a, b) => new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)
  );

  const totalCompletions = history.length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCompletions = history.filter((item) => item.date === todayStr).length;
  const activeDays = new Set(history.map((item) => item.date)).size;

  return (
    <div className="history-view">
      {/* Page Header */}
      <section className="view-header">
        <div className="header-meta">
          <span className="page-pretitle">LOGS</span>
          <h1 className="page-title">Completion History</h1>
          <p className="page-subtitle">
            A comprehensive record of every habit you've checked in.
          </p>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="stats-grid three-col">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Completions</span>
            <span className="stat-icon green"><FiCheckSquare /></span>
          </div>
          <strong className="stat-card-value">{totalCompletions}</strong>
          <span className="stat-card-desc">All check-ins</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Completed Today</span>
            <span className="stat-icon violet"><FiActivity /></span>
          </div>
          <strong className="stat-card-value">{todayCompletions}</strong>
          <span className="stat-card-desc">Done today</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Days</span>
            <span className="stat-icon orange"><FiCalendar /></span>
          </div>
          <strong className="stat-card-value">{activeDays}</strong>
          <span className="stat-card-desc">Days with activity</span>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="dashboard-section history-timeline-section">
        <div className="habits-toolbar">
          <div className="habits-heading-area">
            <span className="section-pretitle">TIMELINE</span>
            <h2 className="section-title">Activity Log</h2>
          </div>

          <div className="habits-controls">
            <div className="search-input-wrap">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search history..."
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
              {habits.map((habit) => (
                <option value={habit.name} key={habit._id}>
                  {habit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state-card">
            <div className="empty-icon"><FiCalendar /></div>
            <h4>Loading history...</h4>
            <p>Fetching your past habit check-ins.</p>
          </div>
        ) : historyDates.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon"><FiCalendar /></div>
            <h4>{history.length === 0 ? "No history yet" : "No matching activity"}</h4>
            <p>
              {history.length === 0
                ? "Complete habits to build up your history log."
                : "Try a different search term or habit filter."}
            </p>
          </div>
        ) : (
          <div className="timeline-container">
            {historyDates.map((date) => (
              <div className="timeline-group" key={date}>
                <div className="timeline-date-header">
                  <span className="timeline-dot"><FiCheckCircle /></span>
                  <div className="timeline-date-text">
                    <strong>{getDayLabel(date)}</strong>
                    {getDayLabel(date) !== "Today" && getDayLabel(date) !== "Yesterday" && (
                      <span className="timeline-date-sub">{formatDate(date)}</span>
                    )}
                  </div>
                </div>

                <div className="timeline-items-list">
                  {groupedHistory[date].map((item) => (
                    <div className="timeline-item-card" key={item.id}>
                      <div className="timeline-item-left">
                        <div className="timeline-icon-wrap">
                          {getHabitIcon(item.habitName)}
                        </div>
                        <div className="timeline-meta">
                          <strong className="timeline-habit-name">{item.habitName}</strong>
                          <span className="timeline-freq">{item.frequency}</span>
                        </div>
                      </div>

                      <span className="timeline-status-badge">
                        <FiCheckCircle /> Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default History;