import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiLayers,
  FiCheckCircle,
  FiZap,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiEdit3
} from "react-icons/fi";

function Profile() {
  const [habits, setHabits] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [name, setName] = useState(() => currentUser?.name || "");
  const [email, setEmail] = useState(() => currentUser?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [avatar, setAvatar] = useState(() => localStorage.getItem("profileImage") || "");
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* Get habits for statistics */
  const getHabits = async () => {
    try {
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Error loading profile habits:", error);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  const totalCompleted = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
  const bestStreak = habits.length === 0 ? 0 : Math.max(...habits.map((h) => Number(h.streak) || 0));

  /* Upload profile photo */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setEditError("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profileImage", reader.result);
      setAvatar(reader.result);
      window.dispatchEvent(new Event("userUpdated"));
    };
    reader.readAsDataURL(file);
  };

  /* Update profile */
  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setEditError("");

    if (!name.trim()) {
      setEditError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setEditError("Email is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put("/auth/profile", {
        name: name.trim(),
        email: email.trim()
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);
      window.dispatchEvent(new Event("userUpdated"));
      setShowEdit(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditError(error.response?.data?.message || "Could not update profile details.");
    } finally {
      setLoading(false);
    }
  };

  /* Change password */
  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.put("/auth/password", {
        currentPassword,
        newPassword
      });

      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPassword(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(error.response?.data?.message || "Could not change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-view">
      {/* Page Header */}
      <section className="view-header">
        <div className="header-meta">
          <span className="page-pretitle">ACCOUNT</span>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">
            Manage your personal credentials, preferences, and overview.
          </p>
        </div>
      </section>

      {/* Header Card (Compact horizontal layout) */}
      <section className="profile-header-card">
        <div className="profile-header-left">
          <div className="profile-avatar-container">
            <div className="profile-avatar-display">
              {avatar ? (
                <img src={avatar} alt="User Profile" />
              ) : (
                <span className="avatar-initials">
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            <label className="avatar-camera-btn" title="Change photo">
              <FiCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="profile-user-headline">
            <h2 className="profile-user-name">{currentUser?.name || "User"}</h2>
            <p className="profile-user-email">{currentUser?.email || "No email"}</p>
          </div>
        </div>

        <div className="profile-header-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setName(currentUser?.name || "");
              setEmail(currentUser?.email || "");
              setEditError("");
              setShowEdit(true);
            }}
          >
            <FiEdit3 /> Edit Profile
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setPasswordError("");
              setPasswordSuccess("");
              setShowPassword(true);
            }}
          >
            <FiLock /> Change Password
          </button>
        </div>
      </section>

      {/* 3 Equal Statistics */}
      <section className="stats-grid three-col">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Habits</span>
            <span className="stat-card-icon violet"><FiLayers /></span>
          </div>
          <strong className="stat-card-value">{habits.length}</strong>
          <span className="stat-card-desc">Active routines</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Completions</span>
            <span className="stat-card-icon green"><FiCheckCircle /></span>
          </div>
          <strong className="stat-card-value">{totalCompleted}</strong>
          <span className="stat-card-desc">Finished check-ins</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Best Streak</span>
            <span className="stat-card-icon orange"><FiZap /></span>
          </div>
          <strong className="stat-card-value">{bestStreak}</strong>
          <span className="stat-card-desc">Days at your peak</span>
        </div>
      </section>

      {/* Account Information Card */}
      <section className="dashboard-section account-info-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <span className="section-pretitle">DETAILS</span>
            <h3 className="section-title">Account Information</h3>
          </div>
        </div>

        <div className="account-details-grid">
          <div className="account-detail-item">
            <div className="detail-icon"><FiUser /></div>
            <div className="detail-meta">
              <span className="detail-label">Full Name</span>
              <strong className="detail-val">{currentUser?.name || "Not specified"}</strong>
            </div>
          </div>

          <div className="account-detail-item">
            <div className="detail-icon"><FiMail /></div>
            <div className="detail-meta">
              <span className="detail-label">Email Address</span>
              <strong className="detail-val">{currentUser?.email || "Not specified"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEdit(false);
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowEdit(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {editError && <div className="form-error-msg">{editError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassword && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPassword(false);
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPassword(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="modal-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-field-wrap">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label="Toggle current password"
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-field-wrap">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle new password"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-field-wrap">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {passwordError && <div className="form-error-msg">{passwordError}</div>}
              {passwordSuccess && <div className="form-success-msg">{passwordSuccess}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPassword(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
