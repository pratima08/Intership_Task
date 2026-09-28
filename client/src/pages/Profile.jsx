import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContextValue";

function Profile() {

  const {
    user,
    token,
    login
  } = useAuth();

  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState(
    user?.name || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  // Password fields
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  // Messages
  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await api.put(
        "/auth/profile",
        {
          name,
          email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser =
        response.data.user;

      // Update Context + localStorage
      login(
        updatedUser,
        token
      );

      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {

      if (error.response) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Unable to connect to server"
        );
      }
    }
  };


  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        response.data.message
      );

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");

    } catch (error) {

      if (error.response) {

        setError(
          error.response.data.message
        );

      } else {

        setError(
          "Unable to connect to server"
        );
      }
    }
  };


  // =========================
  // GO TO DASHBOARD
  // =========================

  const handleDashboard = () => {

    navigate("/dashboard");

  };


  return (
    <div className="profile-page">


      {/* =========================
          HEADER
      ========================= */}

      <div className="profile-header">

        <div>

          <h1>
            My Profile
          </h1>

          <p>
            View and manage your profile
          </p>

        </div>


        <button
          className="dashboard-btn"
          onClick={handleDashboard}
        >
          Dashboard
        </button>

      </div>


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {message && (

        <div className="success-message">

          {message}

        </div>

      )}


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      <div className="profile-container">


        {/* =========================
            PROFILE INFORMATION
        ========================= */}

        <div className="profile-card">

          <h2>
            Profile Information
          </h2>


          <div className="profile-info">


            <div>

              <strong>
                Name
              </strong>

              <p>
                {user?.name || "N/A"}
              </p>

            </div>


            <div>

              <strong>
                Email
              </strong>

              <p>
                {user?.email || "N/A"}
              </p>

            </div>


            <div>

              <strong>
                Role
              </strong>

              <p>
                {user?.role || "N/A"}
              </p>

            </div>


            <div>

              <strong>
                User ID
              </strong>

              <p>
                {user?.id || "N/A"}
              </p>

            </div>


          </div>

        </div>


        {/* =========================
            EDIT PROFILE
        ========================= */}

        <div className="profile-card">

          <h2>
            Edit Profile
          </h2>


          <form
            onSubmit={handleUpdateProfile}
          >

            <label>
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />


            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <button
              type="submit"
              className="update-btn"
            >
              Update Profile
            </button>

          </form>

        </div>


        {/* =========================
            CHANGE PASSWORD
        ========================= */}

        <div className="profile-card">

          <h2>
            Change Password
          </h2>


          <form
            onSubmit={handleChangePassword}
          >

            <label>
              Current Password
            </label>

            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              required
            />


            <label>
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              minLength="6"
              required
            />


            <button
              type="submit"
              className="password-btn"
            >
              Change Password
            </button>

          </form>

        </div>


      </div>

    </div>
  );
}

export default Profile;