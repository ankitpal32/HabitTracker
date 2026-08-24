import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiZap,
  FiTrendingUp,
  FiLayers,
  FiCode,
  FiBookOpen,
  FiActivity,
  FiClock,
  FiAward,
  FiBell,
  FiArrowRight,
  FiMenu,
  FiX,
  FiGithub,
  FiLinkedin
} from "react-icons/fi";
import logo from "../images/logo.png";

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="home-view">
      {/* Header */}
      <header className="home-navbar">
        <div className="home-nav-container">
          <Link to="/" className="home-brand">
            <img src={logo} alt="HabitTrack Logo" className="home-brand-logo" />
            <span className="home-brand-name">HabitTrack</span>
          </Link>

          <div className="home-nav-links desktop-nav">
            <Link to="/login" className="home-nav-link">
              Login
            </Link>
            <Link to="/register" className="btn-primary home-nav-cta">
              Start Your First Habit
            </Link>
          </div>

          <button
            type="button"
            className="home-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="home-mobile-dropdown">
            <Link
              to="/login"
              className="home-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary home-mobile-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Your First Habit
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="home-hero-section">
        <div className="hero-grid-layout">
          <div className="hero-text-content">
            <span className="hero-badge">BUILD A ROUTINE THAT LASTS</span>
            <h1 className="hero-main-title">
              Build habits you can actually keep.
            </h1>
            <p className="hero-lead-text">
              Keep your daily habits simple, stay consistent, and see your progress grow one day at a time.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" className="btn-primary hero-btn-main">
                Start Your First Habit <FiArrowRight />
              </Link>
              <Link to="/login" className="btn-secondary hero-btn-sub">
                Sign In
              </Link>
            </div>

            <span className="hero-subnote">
              Start with one habit. Build from there.
            </span>
          </div>

          <div className="hero-preview-wrapper">
            <div className="preview-card-frame">
              <div className="preview-card-header">
                <div className="preview-header-meta">
                  <span className="preview-pretitle">HabitTrack</span>
                  <h3 className="preview-heading">Today's Routine</h3>
                </div>
                <div className="preview-streak-pill">
                  <FiZap /> 7 Day Streak
                </div>
              </div>

              <div className="preview-habits-list">
                <div className="preview-habit-row done">
                  <div className="preview-row-left">
                    <div className="preview-icon-box violet">
                      <FiCode />
                    </div>
                    <div className="preview-row-meta">
                      <strong className="preview-row-title">Coding Practice</strong>
                      <span className="preview-row-sub">Daily &bull; 7 day streak</span>
                    </div>
                  </div>
                  <span className="preview-status-check done">
                    <FiCheck />
                  </span>
                </div>

                <div className="preview-habit-row done">
                  <div className="preview-row-left">
                    <div className="preview-icon-box green">
                      <FiBookOpen />
                    </div>
                    <div className="preview-row-meta">
                      <strong className="preview-row-title">Reading</strong>
                      <span className="preview-row-sub">Daily &bull; 4 day streak</span>
                    </div>
                  </div>
                  <span className="preview-status-check done">
                    <FiCheck />
                  </span>
                </div>

                <div className="preview-habit-row pending">
                  <div className="preview-row-left">
                    <div className="preview-icon-box orange">
                      <FiActivity />
                    </div>
                    <div className="preview-row-meta">
                      <strong className="preview-row-title">Exercise</strong>
                      <span className="preview-row-sub">Weekly &bull; 2 day streak</span>
                    </div>
                  </div>
                  <span className="preview-status-check pending" />
                </div>
              </div>

              <div className="preview-progress-block">
                <div className="preview-progress-meta">
                  <span>Today's Progress</span>
                  <strong>75%</strong>
                </div>
                <div className="preview-bar-track">
                  <div className="preview-bar-fill" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="home-about-section">
        <div className="about-split-card">
          <div className="about-split-left">
            <span className="section-pretitle">WHY HABITTRACK</span>
            <h2 className="about-headline">Why HabitTrack?</h2>
          </div>

          <div className="about-split-right">
            <p className="about-body-text">
              HabitTrack was created to keep everyday habit tracking simple and distraction-free. Instead of overwhelming you with complicated scoring or rigid setups, it focuses on what matters: picking a habit, checking it off each day, and building quiet momentum over time.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features-section">
        <div className="section-header-centered">
          <span className="section-pretitle">BUILT FOR EVERYDAY USE</span>
          <h2 className="section-headline">Everything you need to stay consistent.</h2>
        </div>

        <div className="features-bento-grid">
          <div className="bento-feature-card prominent-card">
            <div className="feature-card-top">
              <div className="feature-icon-box violet">
                <FiLayers />
              </div>
              <span className="bento-tag">CORE</span>
            </div>
            <h3 className="feature-card-title">Track Habits</h3>
            <p className="feature-card-desc">
              Organize daily and weekly routines in one clean view with one-click check-ins, frequency filters, and search.
            </p>
          </div>

          <div className="bento-feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-box orange">
                <FiZap />
              </div>
            </div>
            <h3 className="feature-card-title">Build Streaks</h3>
            <p className="feature-card-desc">
              Stay motivated with automatic consecutive-day counters that highlight your daily follow-through.
            </p>
          </div>

          <div className="bento-feature-card prominent-card">
            <div className="feature-card-top">
              <div className="feature-icon-box teal">
                <FiTrendingUp />
              </div>
              <span className="bento-tag teal">ANALYTICS</span>
            </div>
            <h3 className="feature-card-title">See Progress</h3>
            <p className="feature-card-desc">
              Understand your momentum with 7-day and 30-day activity charts and per-habit completion breakdowns.
            </p>
          </div>

          <div className="bento-feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-box green">
                <FiClock />
              </div>
            </div>
            <h3 className="feature-card-title">View History</h3>
            <p className="feature-card-desc">
              Look back at all your completed habits grouped cleanly by date on a chronological timeline.
            </p>
          </div>

          <div className="bento-feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-box yellow">
                <FiAward />
              </div>
            </div>
            <h3 className="feature-card-title">Achievements</h3>
            <p className="feature-card-desc">
              Reach simple milestone badges as your consistency grows from your first check-in to longer streaks.
            </p>
          </div>

          <div className="bento-feature-card">
            <div className="feature-card-top">
              <div className="feature-icon-box cyan">
                <FiBell />
              </div>
            </div>
            <h3 className="feature-card-title">Habit Reminders</h3>
            <p className="feature-card-desc">
              Set reminder preferences so your core habits stay top-of-mind without unnecessary noise.
            </p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="home-visual-section">
        <div className="visual-split-layout">
          <div className="visual-text-side">
            <span className="section-pretitle">VISUAL MOMENTUM</span>
            <h2 className="visual-headline">Consistency you can see.</h2>
            <p className="visual-description">
              Small daily actions become easier to understand when your progress is right in front of you. A simple activity timeline keeps your routine tangible.
            </p>
          </div>

          <div className="visual-preview-side">
            <div className="visual-showcase-card">
              <div className="visual-calendar-block">
                <div className="visual-block-header">
                  <span>Weekly Activity</span>
                  <span className="visual-tag-active">7 Days Logged</span>
                </div>
                <div className="visual-days-row">
                  {[
                    { day: "MON", count: 3, done: true },
                    { day: "TUE", count: 4, done: true },
                    { day: "WED", count: 3, done: true },
                    { day: "THU", count: 4, done: true },
                    { day: "FRI", count: 2, done: true },
                    { day: "SAT", count: 4, done: true },
                    { day: "SUN", count: 3, done: true, isToday: true }
                  ].map((item) => (
                    <div
                      key={item.day}
                      className={`visual-day-pill ${item.done ? "active" : ""} ${
                        item.isToday ? "today" : ""
                      }`}
                    >
                      <span className="pill-day">{item.day}</span>
                      <div className="pill-circle">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="visual-metrics-row">
                <div className="visual-streak-tile">
                  <span className="tile-icon orange"><FiZap /></span>
                  <div className="tile-details">
                    <span className="tile-sub">Current streak</span>
                    <strong className="tile-val">7 days</strong>
                  </div>
                </div>

                <div className="visual-progress-tile">
                  <div className="progress-tile-header">
                    <span>Today's progress</span>
                    <strong>75%</strong>
                  </div>
                  <div className="progress-tile-track">
                    <div className="progress-tile-fill" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-section">
        <div className="cta-simple-card">
          <h2 className="cta-simple-title">Start with one habit today.</h2>
          <p className="cta-simple-desc">
            Keep it simple, stay consistent, and build from there.
          </p>
          <Link to="/register" className="btn-primary cta-simple-btn">
            Start Your First Habit <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer-bottom">
        <div className="footer-container">
          <div className="footer-left">
            <Link to="/" className="footer-brand">
              <img src={logo} alt="HabitTrack Logo" className="footer-logo" />
              <span className="footer-brand-name">HabitTrack</span>
            </Link>
            <p className="footer-desc">
              A simple habit tracker for everyday consistency.
            </p>
          </div>

          <div className="footer-right">
            <div className="footer-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <a
                href="https://github.com/ankitpal32/HabitTracker_Ankit-Pal"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
              >
                <FiGithub /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ankitpal32"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
              >
                <FiLinkedin /> LinkedIn
              </a>
            </div>

            <div className="footer-credits-line">
              <span className="footer-credit">Designed &amp; built by Ankit Pal</span>
              <span className="footer-copy">&bull; &copy; 2026 HabitTrack</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;