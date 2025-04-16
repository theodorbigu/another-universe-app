import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CreditsPage = () => {
  const { token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
      setSelectedPackage(packageId);

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
      setSelectedPackage(null);
    }
  };

  if (loading) {
    return (
      <div className="credits-page-container">
        <div className="credits-loading">
          <div className="spinner"></div>
          <p>Loading credit packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="credits-page-container">
        <div className="credits-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="credits-page-container">
      <div className="credits-header">
        <h1>Purchase Credits</h1>
        <p>Choose a credit package to enhance your creative projects</p>
      </div>

      <div className="credit-packages-grid">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`credit-package-card ${
              selectedPackage === pkg.id ? "selected" : ""
            }`}
          >
            <div className="package-header">
              <h2 className="package-name">{pkg.name}</h2>
              <div className="package-price-container">
                <span className="price-currency">$</span>
                <span className="price-amount">
                  {(pkg.price / 100).toFixed(2)}
                </span>
                <span className="price-period">USD</span>
              </div>
            </div>

            <div className="package-credits">
              <div className="credits-icon">💰</div>
              <div className="credits-amount">{pkg.credits}</div>
              <div className="credits-label">Credits</div>
            </div>

            <div className="package-features">
              <ul>
                <li>Generate stunning AI images</li>
                <li>Edit and enhance your creations</li>
                {pkg.id === "large" && <li>Priority processing</li>}
                {pkg.id === "large" && <li>Premium support</li>}
              </ul>
            </div>

            <button
              className="purchase-button"
              onClick={() => handlePurchase(pkg.id)}
              disabled={processingPayment}
            >
              {processingPayment && selectedPackage === pkg.id ? (
                <>
                  <span className="button-spinner"></span>
                  Processing...
                </>
              ) : (
                "Purchase Now"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditsPage;
