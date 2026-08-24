import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import logo from "../images/logo.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Login user */
  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("userUpdated"));

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        getErrorMessage(err, "Login failed. Please verify your credentials.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-viewport">
      <Link to="/" className="auth-back-nav">
        <FiArrowLeft /> Back to Home
      </Link>

      <div className="auth-card-box">
        <div className="auth-brand-header">
          <img src={logo} alt="HabitTrack Logo" className="auth-brand-logo" />
          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-description">
            Sign in to continue your habit streaks and routines.
          </p>
        </div>

        {error && (
          <div className="auth-inline-alert error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-inline-alert success">
            <FiCheckCircle />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form-body">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-trigger"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-bottom-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;