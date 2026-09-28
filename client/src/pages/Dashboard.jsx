import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextValue";
import api from "../services/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    user,
    token,
    logout
  } = useAuth();

  const navigate = useNavigate();

  // =========================
  // GET PROFILE
  // =========================

  useEffect(() => {
    const getProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfile(response.data);

      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
          "Unable to load dashboard"
        );

      } finally {
        setLoading(false);
      }
    };

    getProfile();

  }, [token, navigate, logout]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // PROFILE
  // =========================

  const handleProfile = () => {
    navigate("/profile");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-header">

        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Welcome to your dashboard
          </p>
        </div>

        <div className="dashboard-actions">

          <button
            className="profile-btn"
            onClick={handleProfile}
          >
            Profile
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/products")}
          >
            Products
          </button>

        </div>

      </header>

      {/* =========================
          WELCOME
      ========================= */}

      <section className="welcome-card">

        <h2>
          Welcome, {user?.name || "User"} 👋
        </h2>

        <p>
          Here is your account information.
        </p>

      </section>

      {/* =========================
          DASHBOARD CARDS
      ========================= */}

      <section className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Name</h3>

          <p>
            {user?.name || "N/A"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Email</h3>

          <p>
            {user?.email || "N/A"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Role</h3>

          <p>
            {user?.role || "N/A"}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>User ID</h3>

          <p>
            {
              profile?.userId ||
              user?.id ||
              "N/A"
            }
          </p>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;