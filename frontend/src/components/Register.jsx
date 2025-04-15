import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail, signInWithGoogle } from "../services/auth";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
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
      // Handle registration
      const user = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.displayName
      );

      // For registration, we need to get a token first
      const idToken = await user.getIdToken();

      // Store auth user and token in localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          token: idToken,
        })
      );

      setSuccess("Registration successful!");

      // Clear form
      setFormData({ email: "", password: "", displayName: "" });

      // Redirect to home or login page
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message || "Registration failed");
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

      setSuccess("Registration with Google successful!");

      // Redirect to home
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>
        </div>
      </form>

      <div className="social-login">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-button"
        >
          Register with Google
        </button>
      </div>

      <div className="auth-toggle">
        <Link to="/login" className="toggle-link">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
