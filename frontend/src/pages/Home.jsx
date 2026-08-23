import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiZap,
  FiTrendingUp,
  FiLayers,
  FiCalendar,
  FiActivity,
  FiSmile,
  FiBookOpen,
  FiCompass
} from "react-icons/fi";
import logo from "../images/logo.png";

function Home() {
  const [demoHabits, setDemoHabits] = useState([
    { id: 1, name: "Coding Practice", completed: false, icon: <FiActivity />, frequency: "Daily" },
    { id: 2, name: "Reading", completed: true, icon: <FiBookOpen />, frequency: "Daily" },
    { id: 3, name: "Exercise", completed: false, icon: <FiZap />, frequency: "Weekly" },
    { id: 4, name: "Water Intake", completed: true, icon: <FiCompass />, frequency: "Daily" }
  ]);

  const toggleDemoHabit = (id) => {
    setDemoHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const totalDemo = demoHabits.length;
  const completedDemo = demoHabits.filter((h) => h.completed).length;
  const progressPercent = Math.round((completedDemo / totalDemo) * 100);

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-logo" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="Logo" className="logo-img" style={{ width: 32, height: 32 }} />
          <h2 style={{ margin: 0, fontSize: 21, letterSpacing: "-0.4px" }}>HabitTrack</h2>
        </div>

        <div>
          <Link to="/login" style={{ color: "var(--muted)", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Login
          </Link>
          <Link
            to="/register"
            style={{
              background: "var(--primary)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              marginLeft: 14,
              transition: "background 0.2s"
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <p className="small-heading" style={{ color: "var(--primary)", fontWeight: 800 }}>
            BUILD BETTER HABITS
          </p>
          <h1>
            Small habits.
            <br />
            Big changes.
          </h1>
          <p className="hero-text">
            Track the habits that matter, build your streak, and see your progress one day at a time.
          </p>

          <div className="hero-buttons">
            <Link
              to="/register"
              className="primary-button"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              Start Tracking
            </Link>
            <Link
              to="/login"
              className="secondary-button"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              Login
            </Link>
          </div>
        </div>

        <div className="hero-card" style={{ maxWidth: 440 }}>
          <div className="preview-header" style={{ marginBottom: 16 }}>
            <span className="preview-badge" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <FiActivity size={10} /> Live Simulator
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Today's Routine</span>
              <span style={{ color: "var(--orange)", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                <FiZap /> 7 Day Streak
              </span>
            </div>
          </div>

          <div style={{ background: "var(--surface-soft)", padding: 14, borderRadius: 12, border: "1px solid var(--border)", marginBottom: 16 }}>
            <div className="preview-progress-label">
              <span>Today's Progress</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="preview-progress-bar" style={{ height: 6 }}>
              <div className="preview-progress-bar-fill" style={{ width: `${progressPercent}%`, transition: "width 0.3s ease" }}></div>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>
              {completedDemo} of {totalDemo} completed
            </div>
          </div>

          <div>
            {demoHabits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleDemoHabit(habit.id)}
                className="preview-habit-row"
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  borderLeft: habit.completed ? "3px solid var(--green)" : "3px solid var(--border)"
                }}
              >
                <div className="preview-habit-info">
                  <span>{habit.icon}</span>
                  <div>
                    <div style={{ color: habit.completed ? "var(--muted)" : "var(--text)", textDecoration: habit.completed ? "line-through" : "none" }}>
                      {habit.name}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>{habit.frequency}</div>
                  </div>
                </div>

                <div className="preview-habit-action">
                  {habit.completed ? (
                    <FiCheckCircle style={{ color: "var(--green)" }} />
                  ) : (
                    <span style={{ color: "var(--border)", fontSize: 18 }}>○</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section className="bento-section">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <p className="page-label" style={{ color: "var(--primary)" }}>FEATURES</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", margin: "4px 0" }}>Designed for Consistency</h2>
        </div>

        <div className="bento-grid">
          <div className="bento-card wide">
            <div className="bento-card-icon">
              <FiLayers />
            </div>
            <div>
              <h3>Track Habits</h3>
              <p>Keep your daily routine organized. Create custom habits, set frequencies, and monitor your commitments easily in one place.</p>
            </div>
          </div>

          <div className="bento-card">
            <div className="bento-card-icon" style={{ background: "var(--orange-soft)", color: "var(--orange)" }}>
              <FiZap />
            </div>
            <div>
              <h3>Build Streaks</h3>
              <p>Stay consistent. Watch your streak count grow day-by-day and get motivated to keep showing up.</p>
            </div>
          </div>

          <div className="bento-card">
            <div className="bento-card-icon" style={{ background: "var(--secondary-soft)", color: "var(--secondary)" }}>
              <FiTrendingUp />
            </div>
            <div>
              <h3>See Progress</h3>
              <p>Analyze performance. Clean charts and timeline historical completion grids help you visualize improvements.</p>
            </div>
          </div>

          <div className="bento-card wide">
            <div className="bento-card-icon">
              <FiCalendar />
            </div>
            <div>
              <h3>Stay Consistent</h3>
              <p>Small actions become stronger routines. Get reminders, unlock milestones, and build habit routines that stand the test of time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-stats">
        <div className="homepage-stat-card">
          <h4>HABITS TRACKED</h4>
          <strong>15,000+</strong>
        </div>
        <div className="homepage-stat-card" style={{ borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
          <h4>DAILY PROGRESS</h4>
          <strong>84% avg</strong>
        </div>
        <div className="homepage-stat-card">
          <h4>CURRENT STREAK</h4>
          <strong>18 days</strong>
        </div>
      </section>

      <section className="steps-section" style={{ borderTop: "1px solid var(--border)", paddingTop: 60 }}>
        <p className="page-label" style={{ color: "var(--primary)" }}>STEPS</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", margin: "4px 0" }}>Simple. Habitual. Actionable.</h2>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-num">01</span>
            <div className="step-icon">
              <FiLayers />
            </div>
            <h3>Choose a habit</h3>
            <p>Pick something simple that matters to you. Define whether you want to track it daily or weekly.</p>
          </div>

          <div className="step-card">
            <span className="step-num">02</span>
            <div className="step-icon">
              <FiCheckCircle />
            </div>
            <h3>Complete it</h3>
            <p>Mark it done when you have finished it. Celebrate the immediate win and record your streak.</p>
          </div>

          <div className="step-card">
            <span className="step-num">03</span>
            <div className="step-icon" style={{ color: "var(--orange)" }}>
              <FiZap />
            </div>
            <h3>Build the streak</h3>
            <p>Keep showing up day-by-day. Consistency locks in the habit and powers your progress.</p>
          </div>
        </div>
      </section>

      <section className="motivation-section">
        <div className="motivation-container">
          <div className="motivation-content">
            <p className="page-label" style={{ color: "var(--primary)" }}>MOTIVATION</p>
            <h2>Start small.<br />Stay consistent.</h2>
            <p>
              You don't need a perfect routine. You just need a routine you can keep. Progress is built on small, daily commitments that compound over time.
            </p>
          </div>

          <div className="preview-illustration" style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, marginBottom: 10, fontWeight: 700 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FiSmile style={{ color: "var(--primary)" }} /> Active Habit</span>
              <span style={{ color: "var(--orange)", display: "flex", alignItems: "center", gap: 4 }}><FiZap /> 18 Days</span>
            </div>
            <div className="preview-progress-bar" style={{ height: 6 }}>
              <div className="preview-progress-bar-fill" style={{ width: "90%", background: "var(--primary)" }}></div>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
              90% Consistency score
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-container">
          <div className="home-footer-left">
            <img src={logo} alt="Logo" className="logo-img" style={{ width: 28, height: 28 }} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>HabitTrack</span>
          </div>

          <p className="home-footer-text">
            Build better habits, one day at a time.
          </p>

          <div className="home-footer-right">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;