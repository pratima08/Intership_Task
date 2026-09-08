import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {

  const [profile, setProfile] = useState(null);

  const {
    user,
    token,
    logout
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {

    const getProfile = async () => {

      if (!token) {
        navigate("/login");
        return;
      }

      try {

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

        logout();

        navigate("/login");
      }
    };

    getProfile();

  }, [token, navigate, logout]);

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard</p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* Welcome Section */}
      <section className="welcome-card">

        <h2>
          Welcome, {user?.name || "User"} 👋
        </h2>

        <p>
          Here is your account information.
        </p>

      </section>

      {/* User Cards */}
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
            {profile?.userId || user?.id || "N/A"}
          </p>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;