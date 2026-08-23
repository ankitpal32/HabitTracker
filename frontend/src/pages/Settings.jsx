import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiTrash2, FiBell, FiLogOut } from "react-icons/fi";

function Settings() {
  const navigate = useNavigate();
  const [defaultFrequency, setDefaultFrequency] = useState(
    localStorage.getItem("defaultFrequency") || "Daily"
  );

  const [confirmDelete, setConfirmDelete] = useState(
    localStorage.getItem("confirmDelete") !== "false"
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );

  const [saved, setSaved] = useState(false);

  /* Trigger saved indicator */
  const triggerSaved = () => {
    setSaved(false);
    // Use timeout to reset the indicator
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 1200);
    }, 10);
  };

  const handleFrequencyChange = (event) => {
    const value = event.target.value;
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
    <div className="settings-page">
      <div className="page-heading">
        <div>
          <p className="page-label">SETTINGS</p>

          <h1>Settings</h1>

          <p>Configure your habit tracking preferences.</p>
        </div>

        {saved && <span className="settings-saved">✓ Saved</span>}
      </div>

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Habit Preferences</h2>

          <p>Choose how your habits behave.</p>
        </div>

        <div className="settings-list">
          <div className="setting-card">
            <div className="setting-info">
              <div className="setting-icon"><FiClock /></div>

              <div>
                <h3>Default Frequency</h3>

                <p>Used when you create a new habit.</p>
              </div>
            </div>

            <select
              className="settings-select"
              value={defaultFrequency}
              onChange={handleFrequencyChange}
            >
              <option value="Daily">Daily</option>

              <option value="Weekly">Weekly</option>
            </select>
          </div>

          <div className="setting-card">
            <div className="setting-info">
              <div className="setting-icon"><FiTrash2 /></div>

              <div>
                <h3>Confirm Before Delete</h3>

                <p>Ask before removing a habit.</p>
              </div>
            </div>

            <button
              type="button"
              className={
                confirmDelete ? "toggle-button active" : "toggle-button"
              }
              onClick={handleConfirmDeleteToggle}
              aria-label="Toggle delete confirmation"
            >
              <span></span>
            </button>
          </div>

          <div className="setting-card">
            <div className="setting-info">
              <div className="setting-icon">🌓</div>

              <div>
                <h3>Dark Mode</h3>

                <p>Toggle dark or light color theme.</p>
              </div>
            </div>

            <button
              type="button"
              className={
                darkMode ? "toggle-button active" : "toggle-button"
              }
              onClick={handleDarkModeToggle}
              aria-label="Toggle dark mode"
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Notifications</h2>

          <p>Choose whether habit reminders stay enabled.</p>
        </div>

        <div className="settings-list">
          <div className="setting-card">
            <div className="setting-info">
              <div className="setting-icon"><FiBell /></div>

              <div>
                <h3>Habit Reminders</h3>

                <p>Keep reminder preferences enabled.</p>
              </div>
            </div>

            <button
              type="button"
              className={
                notifications ? "toggle-button active" : "toggle-button"
              }
              onClick={handleNotificationsToggle}
              aria-label="Toggle habit reminders"
            >
              <span></span>
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Account</h2>

          <p>Manage your current session.</p>
        </div>

        <div className="setting-card">
          <div className="setting-info">
            <div className="setting-icon danger"><FiLogOut /></div>

            <div>
              <h3>Sign out</h3>

              <p>Log out of your HabitTrack account.</p>
            </div>
          </div>

          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;
