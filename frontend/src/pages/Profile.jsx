import { useEffect, useState } from "react";
import api from "../services/api";
import {
  FiLayers,
  FiCheckCircle,
  FiZap,
  FiEye,
  FiEyeOff
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

  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("profileImage") || ""
  );

  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* Get habits */
  const getHabits = async () => {
    try {
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (error) {
      console.log("Error loading profile habits:", error);
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  const totalCompleted = habits.reduce(
    (total, habit) =>
      total + (habit.completedDates?.length || 0),
    0
  );

  const bestStreak =
    habits.length === 0
      ? 0
      : Math.max(...habits.map((habit) => Number(habit.streak) || 0));

  /* Upload profile photo */
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2MB.");
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

    if (name.trim() === "") {
      setEditError("Name is required.");
      return;
    }

    if (email.trim() === "") {
      setEditError("Email is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/profile", {
        name: name.trim(),
        email: email.trim()
      });

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      setCurrentUser(response.data.user);
      window.dispatchEvent(new Event("userUpdated"));

      setShowEdit(false);
    } catch (error) {
      console.log("Error updating profile:", error);

      setEditError(
        error.response?.data?.message ||
          "Could not update profile details."
      );
    } finally {
      setLoading(false);
    }
  };

  /* Change password */
  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
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
      console.log("Error changing password:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Could not change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-heading">
        <div>
          <p className="page-label">PROFILE</p>
          <h1>User Profile</h1>
          <p>Manage your profile details and track your stats.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-avatar-area">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {avatar ? (
                <img src={avatar} alt="Profile" />
              ) : (
                currentUser?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <label className="avatar-edit-button" title="Change photo">
              📷
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <div className="profile-user-info">
          <h2>{currentUser?.name || "User"}</h2>
          <p>{currentUser?.email || "No email available"}</p>

          <div className="profile-actions">
            <button
              className="add-button"
              onClick={() => {
                setName(currentUser?.name || "");
                setEmail(currentUser?.email || "");
                setShowEdit(true);
              }}
            >
              Edit Profile
            </button>

            <button
              className="secondary-button"
              onClick={() => setShowPassword(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      <section className="overview profile-stats">
        <div className="stat-card">
          <div className="stat-card-top">
            <span>Total Habits</span>
            <span className="stat-icon"><FiLayers /></span>
          </div>
          <strong className="stat-number">{habits.length}</strong>
          <span className="stat-description">Habits you're tracking</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Completions</span>
            <span className="stat-icon green"><FiCheckCircle /></span>
          </div>
          <strong className="stat-number">{totalCompleted}</strong>
          <span className="stat-description">Total completed habits</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Best Streak</span>
            <span className="stat-icon orange"><FiZap /></span>
          </div>
          <strong className="stat-number">{bestStreak}</strong>
          <span className="stat-description">Days at your best</span>
        </div>
      </section>

      <section className="profile-details">
        <div className="profile-details-heading">
          <div>
            <p className="page-label">PERSONAL</p>
            <h2>Account Information</h2>
          </div>
        </div>

        <div className="profile-row">
          <span>Name</span>
          <strong>{currentUser?.name || "User"}</strong>
        </div>

        <div className="profile-row">
          <span>Email</span>
          <strong>{currentUser?.email || "Not available"}</strong>
        </div>
      </section>

      {showEdit && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowEdit(false);
            }
          }}
        >
          <div className="profile-modal">
            <div className="form-header">
              <div>
                <p className="page-label">PROFILE</p>
                <h2>Edit Profile</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setShowEdit(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {editError && (
                <div style={{ color: "var(--red)", fontSize: "13px", fontWeight: "600", marginBottom: "15px" }}>
                  {editError}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPassword && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowPassword(false);
            }
          }}
        >
          <div className="profile-modal">
            <div className="form-header">
              <div>
                <p className="page-label">SECURITY</p>
                <h2>Change Password</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setShowPassword(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: 0,
                      color: "var(--muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: 0,
                      color: "var(--muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm new password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: 0,
                      color: "var(--muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div style={{ color: "var(--red)", fontSize: "13px", fontWeight: "600", marginBottom: "15px" }}>
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div style={{ color: "var(--green)", fontSize: "13px", fontWeight: "600", marginBottom: "15px" }}>
                  {passwordSuccess}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowPassword(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
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
