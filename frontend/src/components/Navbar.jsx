import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CarFront, SquareUser } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
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
      console.log("Container ScrollTop:", scrollTop);
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

        {/* Conditionally show login/register buttons or profile info */}
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
              {currentUser?.displayName && (
                <span className="display-name">
                  Hi, {currentUser.displayName.split(" ")[0]}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
