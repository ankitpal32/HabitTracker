import { useEffect, useState } from "react";
import api from "../services/api";
import { FiZap, FiCheckCircle, FiBarChart2 } from "react-icons/fi";

function Progress() {
  const [habits, setHabits] = useState([]);
  const [range, setRange] = useState(7);
  const [loading, setLoading] = useState(true);

  /* Get habits */
  const getHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.log("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  /* Basic progress values */
  const completedToday = habits.filter(
    (habit) => habit.completedToday
  ).length;

  const totalHabits = habits.length;

  const todayProgress =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedToday / totalHabits) * 100
        );

  const bestStreak =
    totalHabits === 0
      ? 0
      : Math.max(
          ...habits.map(
            (habit) => Number(habit.streak) || 0
          )
        );

  const totalCompletions = habits.reduce(
    (total, habit) =>
      total + (habit.completedDates?.length || 0),
    0
  );

  /* Get date */
  const getDate = (daysAgo) => {
    const date = new Date();

    date.setDate(date.getDate() - daysAgo);

    return date.toISOString().split("T")[0];
  };

  /* Get activity for one day */
  const getDayData = (daysAgo) => {
    const date = getDate(daysAgo);

    let completed = 0;

    habits.forEach((habit) => {
      if (habit.completedDates?.includes(date)) {
        completed += 1;
      }
    });

    return {
      date,
      completed
    };
  };

  /* Build activity data */
  const activityData = [];

  for (let index = range - 1; index >= 0; index -= 1) {
    const data = getDayData(index);
    const date = new Date(`${data.date}T00:00:00`);

    const label =
      range === 7
        ? date.toLocaleDateString("en-US", {
            weekday: "short"
          })
        : date.toLocaleDateString("en-US", {
            day: "numeric"
          });

    activityData.push({
      ...data,
      label,
      isToday: index === 0
    });
  }

  /* Get completion percentage for a habit */
  const getHabitCompletionPercentage = (habit) => {
    const completedDates = habit.completedDates || [];

    if (completedDates.length === 0) {
      return 0;
    }

    const completedDays = [];

    for (let index = 0; index < range; index += 1) {
      completedDays.push(getDate(index));
    }

    const completedCount = completedDays.filter(
      (date) => completedDates.includes(date)
    ).length;

    const isWeekly = habit.frequency && habit.frequency.toLowerCase() === "weekly";
    const expectedCompletions = isWeekly
      ? Math.max(1, Math.round(range / 7))
      : range;

    return Math.min(100, Math.round(
      (completedCount / expectedCompletions) * 100
    ));
  };

  if (loading) {
    return (
      <div className="progress-page">
        <div className="page-heading">
          <div>
            <p className="page-label">INSIGHTS</p>
            <h1>Your Progress</h1>
            <p>Loading your progress...</p>
          </div>
        </div>

        <div className="empty-card">
          <div className="empty-icon"><FiBarChart2 /></div>
          <h3>Loading progress</h3>
          <p>
            Getting your latest habit activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">

      <div className="page-heading">
        <div>
          <p className="page-label">INSIGHTS</p>
          <h1>Your Progress</h1>
          <p>
            See how consistently you're building your habits.
          </p>
        </div>
      </div>

      <section className="overview">
        <div className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="stat-card-top" style={{ marginBottom: 6 }}>
              <span>Today's Progress</span>
            </div>
            <strong className="stat-number" style={{ margin: 0 }}>
              {todayProgress}%
            </strong>
            <span className="stat-description">
              Daily completion
            </span>
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
                strokeDashoffset={(2 * Math.PI * 18) - (todayProgress / 100) * (2 * Math.PI * 18)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.35s ease" }}
              />
            </svg>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
              {todayProgress}%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Best Streak</span>
            <span className="stat-icon orange">
              <FiZap />
            </span>
          </div>
          <strong className="stat-number">
            {bestStreak}
          </strong>
          <span className="stat-description">
            Days at your best
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Completions</span>
            <span className="stat-icon green">
              <FiCheckCircle />
            </span>
          </div>
          <strong className="stat-number">
            {totalCompletions}
          </strong>
          <span className="stat-description">
            Total completed habits
          </span>
        </div>
      </section>

      <section className="progress-card">
        <div className="progress-card-heading">
          <div>
            <h2>Activity</h2>
            <p>
              Your habit activity over time.
            </p>
          </div>

          <div className="range-buttons">
            <button
              type="button"
              className={
                range === 7
                  ? "range-button active"
                  : "range-button"
              }
              onClick={() => setRange(7)}
            >
              7 Days
            </button>

            <button
              type="button"
              className={
                range === 30
                  ? "range-button active"
                  : "range-button"
              }
              onClick={() => setRange(30)}
            >
              30 Days
            </button>
          </div>
        </div>

        {totalHabits === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">
              <FiBarChart2 />
            </div>
            <h3>No activity yet</h3>
            <p>
              Create a habit and start completing it
              to see your activity here.
            </p>
          </div>
        ) : (
          <div
            className={
              range === 30
                ? "activity-chart month-chart"
                : "activity-chart"
            }
          >
            {activityData.map((day) => {
              const percentage =
                totalHabits === 0
                  ? 0
                  : Math.round(
                      (day.completed /
                        totalHabits) *
                        100
                    );

              return (
                <div
                  className={`activity-day ${day.isToday ? "today" : ""}`}
                  key={day.date}
                  title={`${day.completed} habit${
                    day.completed === 1
                      ? ""
                      : "s"
                  } completed on ${day.date}`}
                >
                  <div className="activity-bar">
                    <div
                      className={day.completed > 0 ? "filled" : "empty"}
                      style={{
                        height: `${
                          percentage === 0
                            ? 6
                            : percentage
                        }%`
                      }}
                    ></div>
                  </div>
                  <span>
                    {day.label}
                  </span>
                  <strong>
                    {day.completed}
                  </strong>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="progress-card">
        <div className="progress-card-heading">
          <div>
            <h2>Habit Performance</h2>
            <p>
              See how each habit is doing.
            </p>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">
              <FiBarChart2 />
            </div>
            <h3>No habits yet</h3>
            <p>
              Your habit performance will appear
              here once you create your first habit.
            </p>
          </div>
        ) : (
          <div className="performance-list">
            {habits.map((habit) => {
              const percentage =
                getHabitCompletionPercentage(habit);

              return (
                <div
                  className="performance-item"
                  key={habit._id}
                >
                  <div className="performance-top">
                    <div>
                      <strong>
                        {habit.name}
                      </strong>
                      <span>
                        {habit.frequency}
                      </span>
                    </div>

                    <div className="performance-streak">
                      🔥 {habit.streak || 0}
                    </div>
                  </div>

                  <div className="performance-mid" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
                    <div className="performance-bar" style={{ flex: 1, height: 8, background: "var(--surface-soft)", borderRadius: 99, overflow: "hidden", display: "block" }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "var(--primary)",
                          borderRadius: "inherit"
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, minWidth: 40, textAlign: "right" }}>
                      {percentage}%
                    </span>
                    <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 60, textAlign: "right" }}>
                      {habit.completedDates?.length || 0} total
                    </span>
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