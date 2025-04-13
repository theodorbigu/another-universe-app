import { Link, useLocation } from "react-router-dom";
import { styles } from "../styles";
import logoImg from "../assets/car-tunning-logo.png";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.navbar}>
      <div style={styles.navbarHeader}>
        <Link to="/">
          <img
            src={logoImg}
            alt="Car Tunning AI Logo"
            style={styles.navbarLogo}
          />
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
