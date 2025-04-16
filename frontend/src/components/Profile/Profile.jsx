import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CreditCard } from "lucide-react";

const Profile = () => {
  const { currentUser, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [creditHistory, setCreditHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
        setError("Failed to load profile data from the database");
      } finally {
        setLoading(false);
      }
    };

    const fetchCreditHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await axios.get(
          "http://localhost:5001/api/credits/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCreditHistory(response.data.transactions);
      } catch (err) {
        console.error("Failed to fetch credit history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (currentUser) {
      fetchUserData();
      fetchCreditHistory();
    } else {
      setLoading(false);
    }
  }, [currentUser, token]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const renderCreditHistory = () => {
    if (loadingHistory) {
      return <p>Loading credit history...</p>;
    }

    if (creditHistory.length === 0) {
      return <p>No credit transactions found.</p>;
    }

    return (
      <div className="credit-history">
        <h3>Credit Transaction History</h3>
        <table className="credit-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {creditHistory.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                <td>{transaction.action_type}</td>
                <td
                  className={
                    transaction.amount < 0
                      ? "credit-negative"
                      : "credit-positive"
                  }
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount}
                </td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
            <h3>Database Profile Data</h3>

            {userData.uid && (
              <div className="profile-field">
                <strong>User ID:</strong> {userData.uid}
              </div>
            )}

            {userData.created_at && (
              <div className="profile-field">
                <strong>Created At:</strong>{" "}
                {new Date(userData.created_at).toLocaleString()}
              </div>
            )}

            {userData.updated_at && (
              <div className="profile-field">
                <strong>Updated At:</strong>{" "}
                {new Date(userData.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Add button to navigate to credits page */}
        <div className="profile-credits-cta">
          <h3>Need more credits?</h3>
          <p>Purchase additional credits to continue creating amazing images</p>
          <button
            className="buy-credits-button"
            onClick={() => navigate("/credits")}
          >
            <CreditCard size={18} strokeWidth={1.5} />
            <span>Buy Credits</span>
          </button>
        </div>

        {renderCreditHistory()}
      </div>

      {error && <div className="profile-container error">{error}</div>}
    </div>
  );
};

export default Profile;
