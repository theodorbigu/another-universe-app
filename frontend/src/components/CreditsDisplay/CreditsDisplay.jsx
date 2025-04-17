import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function CreditsDisplay() {
  const { token } = useAuth();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/credits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCredits(response.data.credits);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch credits:", err);
        setCredits(0);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCredits();
    }
  }, [token]);

  if (loading) return <span>Loading credits...</span>;

  return (
    <div className="credits-display">
      <span className="credits-icon">💰</span>
      <span className="credits-amount">{credits || 0} credits</span>
    </div>
  );
}

export default CreditsDisplay;
