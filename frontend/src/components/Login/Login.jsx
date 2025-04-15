import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signInWithGoogle,
  resetPassword,
} from "../../services/auth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Handle login
      const result = await signInWithEmail(formData.email, formData.password);

      // Store auth user and token in localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          token: result.token,
        })
      );

      setSuccess("Login successful!");

      // Clear form
      setFormData({ email: "", password: "" });

      // Redirect to home or intended page
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await signInWithGoogle();

      // Store auth user and token in localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          token: result.token,
        })
      );

      setSuccess("Login with Google successful!");

      // Redirect to home or intended page
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await resetPassword(formData.email);
      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Processing..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={loading}
            className="reset-button"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      <div className="social-login">
        <div className="divider">
          <span>OR</span>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-button"
        >
          <img src="/google-icon.svg" alt="Google" className="google-icon" />
          Continue with Google
        </button>
      </div>

      <div className="auth-toggle">
        <Link to="/register" className="toggle-link">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
