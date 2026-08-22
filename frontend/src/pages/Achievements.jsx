import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiPlusCircle,
  FiCheckSquare,
  FiZap,
  FiTrendingUp,
  FiAward,
  FiTarget,
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

function Achievements() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* Get habits */
  const getHabits = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/habits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(response.data);
    } catch (error) {
      console.log("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Calculate stats */
  const totalCompletions = habits.reduce(
    (total, habit) => total + (habit.completedDates?.length || 0),
    0,
  );

  const bestStreak =
    habits.length === 0
      ? 0
      : Math.max(...habits.map((habit) => Number(habit.streak) || 0));

  /* Achievement list */
  const achievements = [
    {
      icon: <FiPlusCircle />,
      title: "First Habit",
      description: "Create your first habit.",
      target: 1,
      value: habits.length,
    },
    {
      icon: <FiCheckSquare />,
      title: "Getting Started",
      description: "Complete 3 habits.",
      target: 3,
      value: totalCompletions,
    },
    {
      icon: <FiZap />,
      title: "On Fire",
      description: "Reach a 3 day streak.",
      target: 3,
      value: bestStreak,
    },
    {
      icon: <FiTrendingUp />,
      title: "Momentum",
      description: "Reach a 7 day streak.",
      target: 7,
      value: bestStreak,
    },
    {
      icon: <FiAward />,
      title: "Locked In",
      description: "Complete 10 habits.",
      target: 10,
      value: totalCompletions,
    },
    {
      icon: <FiTarget />,
      title: "Consistency",
      description: "Reach a 14 day streak.",
      target: 14,
      value: bestStreak,
    },
  ];

  /* Progress */
  const getProgress = (achievement) => {
    if (achievement.target === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((achievement.value / achievement.target) * 100),
    );
  };

  /* Status */
  const isUnlocked = (achievement) => {
    return achievement.value >= achievement.target;
  };

  if (loading) {
    return (
      <div className="achievements-page">
        <div className="page-heading">
          <div>
            <p className="page-label">REWARDS</p>

            <h1>Achievements</h1>

            <p>Loading your achievements...</p>
          </div>
        </div>

        <div className="empty-card">
          <div className="empty-icon">
            <FaTrophy />
          </div>

          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-page">
      <div className="page-heading">
        <div>
          <p className="page-label">MILESTONES</p>

          <h1>Achievements</h1>

          <p>Track your milestones and unlock rewards.</p>
        </div>
      </div>

      <div className="achievement-grid">
        {achievements.map((achievement) => {
          const unlocked = isUnlocked(achievement);

          const progress = getProgress(achievement);

          return (
            <div
              className={
                unlocked
                  ? "achievement-card unlocked"
                  : "achievement-card locked"
              }
              key={achievement.title}
            >
              <div className="achievement-icon">{achievement.icon}</div>

              <div className="achievement-content">
                <div className="achievement-title-row">
                  <h3>{achievement.title}</h3>

                  <span
                    className={
                      unlocked
                        ? "achievement-status unlocked"
                        : "achievement-status"
                    }
                  >
                    {unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>

                <p>{achievement.description}</p>

                <div className="achievement-progress">
                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;
