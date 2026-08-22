import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBarChart2,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import logo from "../images/logo.png";

function Layout({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const avatar = localStorage.getItem("profileImage") || "";

  /* Determine topbar context */
  const getContextName = () => {
    const path = window.location.pathname;
    if (path.startsWith("/dashboard")) return "Overview";
    if (path.startsWith("/progress")) return "Insights";
    if (path.startsWith("/history")) return "History";
    if (path.startsWith("/achievements")) return "Milestones";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/settings")) return "Settings";
    return "";
  };
  const contextName = getContextName();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      {menuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <div>
            <h2>HabitTrack</h2>
            <span>Stay consistent</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
            <FiHome />
            Overview
          </NavLink>

          <NavLink to="/progress" onClick={() => setMenuOpen(false)}>
            <FiBarChart2 />
            Progress
          </NavLink>

          <NavLink to="/history" onClick={() => setMenuOpen(false)}>
            <FiClock />
            History
          </NavLink>

          <NavLink to="/achievements" onClick={() => setMenuOpen(false)}>
            <FaTrophy />
            Achievements
          </NavLink>

          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
            <FiUser />
            Profile
          </NavLink>

          <NavLink to="/settings" onClick={() => setMenuOpen(false)}>
            <FiSettings />
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-box">
            <div className="user-avatar">
              {avatar ? (
                <img src={avatar} alt="Avatar" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="user-info">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>

          <button className="sidebar-logout" onClick={logout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-container">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>

            <div className="mobile-logo">
              <img src={logo} alt="Logo" className="logo-img" />
              <strong>HabitTrack</strong>
            </div>

            <div className="topbar-left">
              <span className="topbar-context-title">{contextName}</span>
            </div>

            <div className="topbar-right">
              <button className="notification-button" aria-label="Notifications">
                <FiBell />
              </button>

              <div
                className="topbar-user"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span className="user-name">{user?.name || "User"}</span>
                <span className="caret-indicator">▼</span>

                {dropdownOpen && (
                  <div className="topbar-dropdown">
                    <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>Profile</NavLink>
                    <NavLink to="/settings" onClick={() => setDropdownOpen(false)}>Settings</NavLink>
                    <button onClick={logout} className="dropdown-logout-btn">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
