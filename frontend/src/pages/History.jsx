import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCheckSquare,
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiBookOpen,
  FiBriefcase,
  FiCompass
} from "react-icons/fi";

function History() {
  const [habits, setHabits] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  /* Return custom icon based on habit name */
  const getHabitIcon = (habitName) => {
    const nameLower = habitName.toLowerCase();
    if (nameLower.includes("code") || nameLower.includes("program") || nameLower.includes("dev")) {
      return <FiActivity />;
    }
    if (nameLower.includes("read") || nameLower.includes("book")) {
      return <FiBookOpen />;
    }
    if (nameLower.includes("work") || nameLower.includes("study") || nameLower.includes("office") || nameLower.includes("task")) {
      return <FiBriefcase />;
    }
    return <FiCompass />;
  };

  const token = localStorage.getItem("token");

  /* Get habits */
  const getHabits = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3000/api/habits",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setHabits(response.data);
    } catch (error) {
      console.log("Error loading history:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Build history */
  const history = [];

  habits.forEach((habit) => {
    const completedDates = habit.completedDates || [];

    completedDates.forEach((date) => {
      history.push({
        id: `${habit._id}-${date}`,
        habitId: habit._id,
        habitName: habit.name,
        frequency: habit.frequency,
        date
      });
    });
  });

  history.sort(
    (a, b) =>
      new Date(`${b.date}T00:00:00`) -
      new Date(`${a.date}T00:00:00`)
  );

  /* Filter history */
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.habitName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      item.habitName === filter;

    return matchesSearch && matchesFilter;
  });

  /* Format date */
  const formatDate = (dateString) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  /* Get relative day */
  const getDayLabel = (dateString) => {
    const today = new Date();
    const date = new Date(
      `${dateString}T00:00:00`
    );

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const difference =
      Math.round(
        (today - date) /
          (1000 * 60 * 60 * 24)
      );

    if (difference === 0) {
      return "Today";
    }

    if (difference === 1) {
      return "Yesterday";
    }

    return formatDate(dateString);
  };

  /* Group history by date */
  const groupedHistory = {};

  filteredHistory.forEach((item) => {
    if (!groupedHistory[item.date]) {
      groupedHistory[item.date] = [];
    }

    groupedHistory[item.date].push(item);
  });

  const historyDates = Object.keys(
    groupedHistory
  ).sort(
    (a, b) =>
      new Date(`${b}T00:00:00`) -
      new Date(`${a}T00:00:00`)
  );

  const totalCompletions = history.length;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayCompletions = history.filter(
    (item) => item.date === today
  ).length;

  const activeDays = new Set(
    history.map((item) => item.date)
  ).size;



  if (loading) {
    return (
      <div className="history-page">
        <div className="page-heading">
          <div>
            <p className="page-label">
              HISTORY
            </p>

            <h1>Your Habit History</h1>

            <p>
              Loading your activity...
            </p>
          </div>
        </div>

        <div className="empty-card">
          <div className="empty-icon">
            <FiCalendar />
          </div>

          <h3>Loading history</h3>

          <p>
            Getting your latest completed habits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">

      <div className="page-heading">

        <div>
          <p className="page-label">
            HISTORY
          </p>

          <h1>Your Habit History</h1>

          <p>
            Keep track of the days you've stayed consistent.
          </p>
        </div>



      </div>

      <section className="overview">

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Total Completions</span>

            <span className="stat-icon green">
              <FiCheckSquare />
            </span>
          </div>

          <strong className="stat-number">
            {totalCompletions}
          </strong>

          <span className="stat-description">
            All completed habits
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Today</span>

            <span className="stat-icon purple">
              <FiActivity />
            </span>
          </div>

          <strong className="stat-number">
            {todayCompletions}
          </strong>

          <span className="stat-description">
            Habits completed today
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Active Days</span>

            <span className="stat-icon orange">
              <FiCalendar />
            </span>
          </div>

          <strong className="stat-number">
            {activeDays}
          </strong>

          <span className="stat-description">
            Days with activity
          </span>
        </div>

      </section>

      <section className="history-section">

        <div className="history-tools">

          <div>
            <p className="page-label">
              ACTIVITY
            </p>

            <h2>Completed Habits</h2>

            <p>
              Your completion timeline.
            </p>
          </div>

          <div className="history-filters">

            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option value="All">
                All habits
              </option>

              {habits.map((habit) => (
                <option
                  value={habit.name}
                  key={habit._id}
                >
                  {habit.name}
                </option>
              ))}
            </select>

          </div>

        </div>

        {historyDates.length === 0 ? (

          <div className="empty-card history-empty">

            <div className="empty-icon">
              <FiCalendar />
            </div>

            <h3>
              {history.length === 0
                ? "No history yet"
                : "No matching activity"}
            </h3>

            <p>
              {history.length === 0
                ? "Complete a habit and your activity will appear here."
                : "Try a different search or habit filter."}
            </p>

          </div>

        ) : (

          <div className="history-timeline">

            {historyDates.map((date) => (

              <div
                className="history-day"
                key={date}
              >

                <div className="history-date">

                  <div className="history-date-dot">
                    <FiCheckCircle />
                  </div>

                  <div>
                    <strong>
                      {getDayLabel(date)}
                    </strong>

                    {getDayLabel(date) !== "Today" &&
                      getDayLabel(date) !== "Yesterday" && (
                        <span>
                          {formatDate(date)}
                        </span>
                      )}

                  </div>

                </div>

                <div className="history-day-items">

                  {groupedHistory[date].map(
                    (item) => (
                      <div
                        className="history-entry"
                        key={item.id}
                      >

                        <div className="history-entry-icon">
                          {getHabitIcon(item.habitName)}
                        </div>

                        <div className="history-entry-content">

                          <strong>
                            {item.habitName}
                          </strong>

                          <span>
                            {item.frequency}
                          </span>

                        </div>

                        <div className="history-entry-status">
                          Completed
                        </div>

                      </div>
                    )
                  )}

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