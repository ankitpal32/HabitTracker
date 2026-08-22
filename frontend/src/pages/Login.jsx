import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import logo from "../images/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Login user */
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: email.trim(),
          password
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Login successful! Redirecting...");

      /* Redirect to dashboard */
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);

    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
        "Login failed. Please verify your credentials."
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
          <h1>Welcome back</h1>
          <p>Login to resume your streaks and build healthy daily routines.</p>
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

        <form onSubmit={handleLogin}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                style={{ paddingRight: "44px" }}
              />

              {/* Toggle password */}
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
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
            style={{ width: "100%", height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;