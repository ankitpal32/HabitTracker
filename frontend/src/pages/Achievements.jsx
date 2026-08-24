import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiPlusCircle,
  FiCheckSquare,
  FiZap,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiLock,
  FiUnlock
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

function Achievements() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Get habits */
  const getHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  const totalCompletions = habits.reduce(
    (acc, habit) => acc + (habit.completedDates?.length || 0),
    0
  );

  const bestStreak =
    habits.length === 0
      ? 0
      : Math.max(...habits.map((habit) => Number(habit.streak) || 0));

  /* Exactly 6 achievements */
  const achievements = [
    {
      icon: <FiPlusCircle />,
      title: "First Habit",
      description: "Create your first habit.",
      target: 1,
      value: habits.length
    },
    {
      icon: <FiCheckSquare />,
      title: "Getting Started",
      description: "Complete 3 habits.",
      target: 3,
      value: totalCompletions
    },
    {
      icon: <FiZap />,
      title: "On Fire",
      description: "Reach a 3 day streak.",
      target: 3,
      value: bestStreak
    },
    {
      icon: <FiTrendingUp />,
      title: "Momentum",
      description: "Reach a 7 day streak.",
      target: 7,
      value: bestStreak
    },
    {
      icon: <FiAward />,
      title: "Locked In",
      description: "Complete 10 habits.",
      target: 10,
      value: totalCompletions
    },
    {
      icon: <FiTarget />,
      title: "Consistency",
      description: "Reach a 14 day streak.",
      target: 14,
      value: bestStreak
    }
  ];

  const getProgress = (achievement) => {
    if (achievement.target === 0) return 0;
    return Math.min(100, Math.round((achievement.value / achievement.target) * 100));
  };

  const isUnlocked = (achievement) => achievement.value >= achievement.target;
  const unlockedCount = achievements.filter(isUnlocked).length;

  if (loading) {
    return (
      <div className="achievements-view">
        <section className="view-header">
          <div className="header-meta">
            <span className="page-pretitle">MILESTONES</span>
            <h1 className="page-title">Achievements & Badges</h1>
            <p className="page-subtitle">Loading your milestones...</p>
          </div>
        </section>
        <div className="empty-state-card">
          <div className="empty-icon"><FaTrophy /></div>
          <h4>Loading achievements...</h4>
          <p>Fetching your latest unlocked badges and milestone stats.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-view">

      {/* Page Header */}
      <section className="view-header">
        <div className="header-meta">
          <span className="page-pretitle">MILESTONES</span>
          <h1 className="page-title">Achievements & Badges</h1>
          <p className="page-subtitle">
            Celebrate your habit milestones as your consistency compounds.
          </p>
        </div>
      </section>

      {/* Progress banner */}
      <div className="achievements-banner-card">
        <div className="banner-icon-wrap">
          <FaTrophy />
        </div>
        <div className="banner-text-wrap">
          <h3>{unlockedCount} of 6 Unlocked</h3>
          <p>Keep building streaks and checking in daily to unlock remaining badges.</p>
        </div>
        <div className="banner-progress-wrap">
          <div className="banner-track">
            <div
              className="banner-fill"
              style={{ width: `${Math.round((unlockedCount / 6) * 100)}%` }}
            />
          </div>
          <span className="banner-pct">{Math.round((unlockedCount / 6) * 100)}%</span>
        </div>
      </div>

      {/* 6 Achievements Grid */}
      <div className="achievements-grid">
        {achievements.map((item) => {
          const unlocked = isUnlocked(item);
          const progressPct = getProgress(item);

          return (
            <div
              key={item.title}
              className={`achievement-card ${unlocked ? "unlocked" : "locked"}`}
            >
              <div className="achievement-top">
                <div className="achievement-icon-box">{item.icon}</div>
                <span className={`achievement-badge ${unlocked ? "badge-unlocked" : "badge-locked"}`}>
                  {unlocked ? <><FiUnlock /> Unlocked</> : <><FiLock /> Locked</>}
                </span>
              </div>

              <div className="achievement-body">
                <h4 className="achievement-title">{item.title}</h4>
                <p className="achievement-desc">{item.description}</p>
              </div>

              <div className="achievement-footer">
                <div className="achievement-progress-label">
                  <span>Progress</span>
                  <strong>{Math.min(item.value, item.target)} / {item.target}</strong>
                </div>
                <div className="achievement-progress-track">
                  <div
                    className="achievement-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
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
