import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBarChart2,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import logo from "../images/logo.png";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("profileImage") || "",
  );

  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
      setAvatar(localStorage.getItem("profileImage") || "");
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-inner-container">
          {/* Left: Brand Logo & Wordmark */}
          <Link to="/dashboard" className="navbar-brand-link">
            <img src={logo} alt="HabitTrack Logo" className="navbar-logo-img" />
            <span className="navbar-brand-name">HabitTrack</span>
          </Link>

          {/* Center: Horizontal Navigation Links (Desktop) */}
          <nav className="desktop-navbar-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              <FiHome className="nav-item-icon" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/progress"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              <FiBarChart2 className="nav-item-icon" />
              <span>Progress</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              <FiClock className="nav-item-icon" />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/achievements"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              <FaTrophy className="nav-item-icon" />
              <span>Achievements</span>
            </NavLink>
          </nav>

          {/* Right: Notifications & User Profile Menu */}
          <div className="navbar-actions-right">
            <button
              type="button"
              className="navbar-icon-btn"
              title="Notifications"
              aria-label="Notifications"
            >
              <FiBell />
            </button>

            {/* User Dropdown */}
            <div className="navbar-user-dropdown-wrap">
              <button
                type="button"
                className="navbar-user-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="navbar-user-avatar">
                  {avatar ? (
                    <img src={avatar} alt="User avatar" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span className="navbar-user-name">{user?.name || "User"}</span>
                <FiChevronDown className="navbar-chevron-icon" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="dropdown-overlay"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="navbar-dropdown-panel">
                    <NavLink
                      to="/profile"
                      className="dropdown-menu-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiUser /> Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className="dropdown-menu-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiSettings /> Settings
                    </NavLink>
                    <div className="dropdown-divider-line" />
                    <button
                      type="button"
                      className="dropdown-menu-link danger"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="mobile-nav-panel">
            <div className="mobile-user-banner">
              <div className="navbar-user-avatar">
                {avatar ? (
                  <img src={avatar} alt="User avatar" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="mobile-user-details">
                <strong>{user?.name || "User"}</strong>
                <span>{user?.email || ""}</span>
              </div>
            </div>

            <nav className="mobile-nav-list">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <FiHome /> Dashboard
              </NavLink>

              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <FiBarChart2 /> Progress
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <FiClock /> History
              </NavLink>

              <NavLink
                to="/achievements"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <FaTrophy /> Achievements
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <FiUser /> Profile
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                <FiSettings /> Settings
              </NavLink>

              <div className="mobile-nav-divider" />

              <button
                type="button"
                className="mobile-nav-link logout-btn"
                onClick={logout}
              >
                <FiLogOut /> Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="app-content-body">{children}</main>
    </div>
  );
}

export default Layout;
