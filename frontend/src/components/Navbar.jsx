import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CarFront, SquareUser, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CreditsDisplay from "./CreditsDisplay";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isActive = (path) => location.pathname === path;
  const isHomeActive = location.pathname === "/";
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById("main-content-area");

    if (!scrollContainer) {
      console.error("Scrollable container #main-content-area not found.");
      return;
    }

    const handleScroll = (event) => {
      const scrollTop = event.target.scrollTop;
      if (scrollTop > 0) {
        setShowBorder(true);
      } else {
        setShowBorder(false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`navbar ${showBorder ? "navbar-scrolled" : ""}`}>
      <div className="navbar-header">
        <Link to="/">
          <div
            className={`navbar-logo-link ${
              isHomeActive ? "navbar-logo-link-active" : ""
            }`}
          >
            <CarFront
              size={60}
              strokeWidth={1}
              color={isHomeActive ? "#b5332f" : "white"}
            />
          </div>
        </Link>
      </div>

      {/* New container for right-aligned items */}
      <div className="navbar-right-container">
        <div className="nav-list">
          <Link
            to="/generate"
            className={`nav-item ${
              isActive("/generate") ? "nav-item-active" : ""
            }`}
          >
            Generate
          </Link>
          <Link
            to="/edit"
            className={`nav-item ${isActive("/edit") ? "nav-item-active" : ""}`}
          >
            Edit
          </Link>
          <Link
            to="/creations"
            className={`nav-item ${
              isActive("/creations") ? "nav-item-active" : ""
            }`}
          >
            Creations
          </Link>
          <Link
            to="/slider"
            className={`nav-item ${
              isActive("/slider") ? "nav-item-active" : ""
            }`}
          >
            Compare
          </Link>

          {/* Add credits link for authenticated users */}
          {isAuthenticated && (
            <Link
              to="/credits"
              className={`nav-item ${
                isActive("/credits") ? "nav-item-active" : ""
              }`}
            >
              <CreditCard size={18} strokeWidth={1.5} className="nav-icon" />
              <span>Buy Credits</span>
            </Link>
          )}

          {/* Show user icon only when authenticated */}
          {isAuthenticated && (
            <Link
              to="/profile"
              className={`nav-item user-icon ${
                isActive("/profile") ? "nav-item-active" : ""
              }`}
            >
              <SquareUser size={28} strokeWidth={1.5} />
            </Link>
          )}
        </div>

        {/* Conditionally show login/register buttons or credit display */}
        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <button
                className="button button-login"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
              <button
                className="button button-login"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          ) : (
            <div className="user-info">
              <div
                className="credits-display-container"
                onClick={() => navigate("/credits")}
              >
                <CreditsDisplay />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
