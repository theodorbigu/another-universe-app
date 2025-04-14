import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CarFront } from "lucide-react";

function Navbar() {
  const location = useLocation();
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
              color={isHomeActive ? "#fc0800" : "white"}
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
        </div>
        <div className="navbar-actions">
          <button className="button button-outline">Login</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
