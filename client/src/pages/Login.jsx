import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Context API se login function
  const { login } = useAuth();

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    try {

      // Backend Login API
      const response = await api.post(
        "/auth/login",
        formData
      );

      const data = response.data;

      // Context me user aur token save
      login(data.user, data.token);

      setMessage("Login successful!");

      // Dashboard par redirect
      navigate("/dashboard");

    } catch (error) {

      if (error.response) {

        setMessage(
          error.response.data.message
        );

      } else {

        setMessage(
          "Unable to connect to server"
        );

      }

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
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
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