import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import logo from "../images/logo.png";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getPasswordStrength = () => {
    if (!password) return "";
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength === 1) return "Weak";
    if (strength === 2) return "Medium";
    return "Strong";
  };

  const passwordStrength = getPasswordStrength();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password
      });

      setSuccess(
        response.data.message || "Account created successfully. Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-btn">
        <FiArrowLeft /> Back to Home
      </Link>

      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="Logo" className="logo-img" style={{ width: 44, height: 44 }} />
          <h1>Create your account</h1>
          <p>Start tracking, building streaks, and leveling up your routines.</p>
        </div>

        {error && (
          <div className="auth-message error">
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-message success">
            <FiCheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label>
            <span>Full Name</span>
            <input
              type="text"
              placeholder="Alex Mercer"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              disabled={loading}
            />
          </label>

          <label>
            <span>Email Address</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={loading}
            />
          </label>

          <label>
            <span>Password</span>
            <div className="password-input" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                style={{ paddingRight: "44px" }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--muted)"
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {password && (
              <div className="password-strength-container">
                <div className="password-strength-text">
                  <span>Password Strength</span>
                  <span
                    style={{
                      color:
                        passwordStrength === "Weak"
                          ? "var(--red)"
                          : passwordStrength === "Medium"
                          ? "var(--orange)"
                          : "var(--green)"
                    }}
                  >
                    {passwordStrength}
                  </span>
                </div>

                <div className="password-strength-bars">
                  <span
                    className={
                      passwordStrength
                        ? passwordStrength === "Weak"
                          ? "weak"
                          : passwordStrength === "Medium"
                          ? "medium"
                          : "strong"
                        : ""
                    }
                  ></span>
                  <span
                    className={
                      passwordStrength === "Medium"
                        ? "medium"
                        : passwordStrength === "Strong"
                        ? "strong"
                        : ""
                    }
                  ></span>
                  <span className={passwordStrength === "Strong" ? "strong" : ""}></span>
                </div>
              </div>
            )}
          </label>

          <label>
            <span>Confirm Password</span>
            <div className="password-input" style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                style={{ paddingRight: "44px" }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--muted)"
                }}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
            style={{ width: "100%", height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;