import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { styles } from "../styles";
import { CarFront } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
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
    <div
      style={{
        ...styles.navbar,
        ...(showBorder ? styles.navbarScrolled : {}),
      }}
    >
      <div style={styles.navbarHeader}>
        <Link to="/">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            <CarFront size={40} strokeWidth={1} />
            {/* <h2> Car Tunning AI</h2> */}
          </div>
        </Link>
      </div>
      <div style={styles.navList}>
        <Link
          to="/generate"
          style={{
            ...styles.navItem,
            ...(isActive("/generate") ? styles.navItemActive : {}),
          }}
        >
          Generate
        </Link>
        <Link
          to="/edit"
          style={{
            ...styles.navItem,
            ...(isActive("/edit") ? styles.navItemActive : {}),
          }}
        >
          Edit
        </Link>
        <Link
          to="/creations"
          style={{
            ...styles.navItem,
            ...(isActive("/creations") ? styles.navItemActive : {}),
          }}
        >
          Creations
        </Link>
        <Link
          to="/slider"
          style={{
            ...styles.navItem,
            ...(isActive("/slider") ? styles.navItemActive : {}),
          }}
        >
          Compare
        </Link>
      </div>
      <div style={styles.navbarActions}>
        <button style={{ ...styles.button, ...styles.buttonOutline }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Navbar;
