import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const PaymentSuccess = () => {
  const { token } = useAuth();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (sessionId) {
      checkPaymentStatus(sessionId);
    } else {
      setError("No payment session found");
    }
  }, [location.search, token]);

  const checkPaymentStatus = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/payments/payment-status/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.payment_status === "paid") {
        setStatus("success");
      } else if (response.data.payment_status === "unpaid") {
        setStatus("failed");
      } else {
        setStatus("processing");
        // Recheck after 3 seconds if still processing
        setTimeout(() => checkPaymentStatus(sessionId), 3000);
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      setError("Failed to verify payment status");
    }
  };

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="payment-success">
      <div className="payment-card">
        <h2>Payment Status</h2>

        {status === "processing" && (
          <div className="payment-processing">
            <div className="spinner"></div>
            <p>Processing your payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="payment-complete">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>
              Thank you for your purchase. Your credits have been added to your
              account.
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="payment-failed">
            <div className="failed-icon">⚠</div>
            <h3>Payment Failed</h3>
            <p>We couldn't process your payment. Please try again.</p>
          </div>
        )}

        {error && (
          <div className="payment-error">
            <p>{error}</p>
          </div>
        )}

        <button onClick={handleBackToProfile} className="back-button">
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
