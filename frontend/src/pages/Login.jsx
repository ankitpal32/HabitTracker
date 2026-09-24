import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiZap, FiEdit3 } from "react-icons/fi";
import logo from "../images/logo.png";

const DEMO_EMAIL = "demo@habittrack.com";
const DEMO_PASSWORD = "Password@123";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Core login execution */
  const performLogin = async (targetEmail, targetPassword) => {
    if (loading) return;

    setError("");
    setSuccess("");

    if (!targetEmail.trim() || !targetPassword) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      let response;
      try {
        response = await api.post("/auth/login", {
          email: targetEmail.trim(),
          password: targetPassword
        });
      } catch (err) {
        // If demo user doesn't exist in MongoDB yet, auto-register then login seamlessly
        if (
          targetEmail.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() &&
          (err.response?.status === 401 || err.response?.status === 400)
        ) {
          try {
            await api.post("/auth/register", {
              name: "Demo Recruiter",
              email: DEMO_EMAIL,
              password: DEMO_PASSWORD
            });
            response = await api.post("/auth/login", {
              email: DEMO_EMAIL,
              password: DEMO_PASSWORD
            });
          } catch (regErr) {
            throw err;
          }
        } else {
          throw err;
        }
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("userUpdated"));

      setSuccess("Login successful! Redirecting to dashboard...");
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

  /* Regular form submit */
  const handleLogin = (event) => {
    event.preventDefault();
    performLogin(email, password);
  };

  /* Recruiter 1-click Demo Login */
  const handleQuickDemoLogin = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    performLogin(DEMO_EMAIL, DEMO_PASSWORD);
  };

  /* Recruiter Autofill Only */
  const handleAutofill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
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
              placeholder="ankit@gmail.com"
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

        <div className="auth-divider">
          <span>or recruiter demo</span>
        </div>

        <div className="demo-auth-box">
          <div className="demo-auth-header">
            <span className="demo-auth-title">
              <FiZap /> Quick Demo Access
            </span>
          </div>
          <p className="demo-auth-hint">
            One-click instant login for recruiters & reviewers to test all features.
          </p>
          <div className="demo-auth-actions">
            <button
              type="button"
              className="btn-demo-quick"
              onClick={handleQuickDemoLogin}
              disabled={loading}
            >
              <FiZap /> {loading ? "Signing in..." : "Demo Login (1-Click)"}
            </button>
            <button
              type="button"
              className="btn-demo-fill"
              onClick={handleAutofill}
              disabled={loading}
              title="Populate demo email & password into input fields"
            >
              <FiEdit3 /> Autofill
            </button>
          </div>
        </div>

        <p className="auth-bottom-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;