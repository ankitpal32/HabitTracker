import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiTrash2, FiBell, FiMoon, FiLogOut, FiCheck } from "react-icons/fi";

function Settings() {
  const navigate = useNavigate();
  const [defaultFrequency, setDefaultFrequency] = useState(
    () => localStorage.getItem("defaultFrequency") || "Daily"
  );
  const [confirmDelete, setConfirmDelete] = useState(
    () => localStorage.getItem("confirmDelete") !== "false"
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("notifications") !== "false"
  );
  const [saved, setSaved] = useState(false);

  /* Indicator flash */
  const triggerSaved = () => {
    setSaved(false);
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 1200);
    }, 10);
  };

  const handleFrequencyChange = (e) => {
    const value = e.target.value;
    setDefaultFrequency(value);
    localStorage.setItem("defaultFrequency", value);
    triggerSaved();
  };

  const handleConfirmDeleteToggle = () => {
    const nextVal = !confirmDelete;
    setConfirmDelete(nextVal);
    localStorage.setItem("confirmDelete", String(nextVal));
    triggerSaved();
  };

  const handleDarkModeToggle = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    localStorage.setItem("darkMode", String(nextVal));
    document.body.classList.toggle("dark-mode", nextVal);
    triggerSaved();
  };

  const handleNotificationsToggle = () => {
    const nextVal = !notifications;
    setNotifications(nextVal);
    localStorage.setItem("notifications", String(nextVal));
    triggerSaved();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  return (
    <div className="settings-view">
      {/* Page Header */}
      <section className="view-header">
        <div className="header-meta-row">
          <div className="header-meta">
            <span className="page-pretitle">PREFERENCES</span>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">
              Keep HabitTrack simple and configured for you.
            </p>
          </div>

          {saved && (
            <span className="settings-saved-pill">
              <FiCheck /> Saved
            </span>
          )}
        </div>
      </section>

      {/* Habit Preferences Section */}
      <section className="dashboard-section settings-group-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">GENERAL</span>
            <h3 className="section-title">Habit Preferences</h3>
            <p className="section-subtitle">Choose how your habits behave.</p>
          </div>
        </div>

        <div className="settings-rows-card">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-icon-box"><FiClock /></div>
              <div className="setting-text">
                <strong>Default Frequency</strong>
                <p>Pre-selected frequency when creating new habits.</p>
              </div>
            </div>
            <select
              value={defaultFrequency}
              onChange={handleFrequencyChange}
              className="settings-select-field"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-icon-box"><FiTrash2 /></div>
              <div className="setting-text">
                <strong>Confirm Before Delete</strong>
                <p>Display confirmation prompt before removing a habit.</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${confirmDelete ? "active" : ""}`}
              onClick={handleConfirmDeleteToggle}
              aria-label="Toggle delete confirmation"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-icon-box"><FiMoon /></div>
              <div className="setting-text">
                <strong>Dark Theme</strong>
                <p>Toggle deep dark color palette for late night sessions.</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${darkMode ? "active" : ""}`}
              onClick={handleDarkModeToggle}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="dashboard-section settings-group-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">ALERTS</span>
            <h3 className="section-title">Notifications</h3>
            <p className="section-subtitle">Manage your alerts and habit reminders.</p>
          </div>
        </div>

        <div className="settings-rows-card">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-icon-box"><FiBell /></div>
              <div className="setting-text">
                <strong>Habit Reminders</strong>
                <p>Enable visual reminder notifications and alerts.</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch-btn ${notifications ? "active" : ""}`}
              onClick={handleNotificationsToggle}
              aria-label="Toggle habit reminders"
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="dashboard-section settings-group-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">SESSION</span>
            <h3 className="section-title">Account Session</h3>
            <p className="section-subtitle">Manage your active session and sign out.</p>
          </div>
        </div>

        <div className="settings-rows-card">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-icon-box danger"><FiLogOut /></div>
              <div className="setting-text">
                <strong>Sign Out</strong>
                <p>Safely log out of your current HabitTrack session.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-danger-outline"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
