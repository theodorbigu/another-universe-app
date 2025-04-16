import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CreditPurchase = ({ onPurchaseComplete }) => {
  const { token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/payments/packages"
        );
        setPackages(response.data.packages);
        setError(null);
      } catch (err) {
        console.error("Failed to load credit packages:", err);
        setError("Failed to load available credit packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePurchase = async (packageId) => {
    try {
      setProcessingPayment(true);

      const response = await axios.post(
        "http://localhost:5001/api/payments/create-checkout-session",
        { packageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
      setError("Payment processing failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="credit-packages-loading">Loading packages...</div>;
  }

  if (error) {
    return <div className="credit-packages-error">{error}</div>;
  }

  return (
    <div className="credit-packages">
      <h3>Purchase Credits</h3>
      <div className="packages-container">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <div className="package-name">{pkg.name}</div>
            <div className="package-credits">{pkg.credits} credits</div>
            <div className="package-price">
              ${(pkg.price / 100).toFixed(2)} USD
            </div>
            <button
              className="purchase-button"
              onClick={() => handlePurchase(pkg.id)}
              disabled={processingPayment}
            >
              {processingPayment ? "Processing..." : "Purchase"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditPurchase;
