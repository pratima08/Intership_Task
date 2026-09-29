import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContextValue";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const email = formData.email.trim();
    const password = formData.password;

    // ==========================
    // VALIDATION
    // ==========================

    if (!email) {
      setMessage("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (!password) {
      setMessage("Password is required");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters"
      );
      return;
    }

    // ==========================
    // LOGIN API
    // ==========================

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      const data = response.data;

      login(data.user, data.token);

      setMessage("Login successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
          "Login failed"
        );
      } else {
        setMessage(
          "Unable to connect to server"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

        <p>
          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;