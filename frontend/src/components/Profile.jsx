import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data from backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/profile", {
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
          },
        });
        setUserData(response.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return (
      <>
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
        </div>
        <div className="profile-container error">{error}</div>;
      </>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-actions">
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      <div className="profile-info">
        <div className="profile-field">
          <strong>Email:</strong> {currentUser.email}
        </div>

        {currentUser.displayName && (
          <div className="profile-field">
            <strong>Name:</strong> {currentUser.displayName}
          </div>
        )}

        {currentUser.photoURL && (
          <div className="profile-avatar">
            <img src={currentUser.photoURL} alt="Profile" />
          </div>
        )}

        <div className="profile-field">
          <strong>Account Created:</strong>{" "}
          {currentUser.metadata.creationTime
            ? new Date(currentUser.metadata.creationTime).toLocaleString()
            : "Unknown"}
        </div>

        <div className="profile-field">
          <strong>Last Sign In:</strong>{" "}
          {currentUser.metadata.lastSignInTime
            ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
            : "Unknown"}
        </div>

        {/* Supabase data if available */}
        {userData && (
          <div className="extended-profile">
            <h3>Extended Profile Data</h3>
            {userData.created_at && (
              <div className="profile-field">
                <strong>Created At:</strong>{" "}
                {new Date(userData.created_at).toLocaleString()}
              </div>
            )}
            {/* Add other fields from Supabase here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
