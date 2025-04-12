import { Link, useLocation } from "react-router-dom";
import { styles } from "../styles";
import logoImg from "../assets/car-tunning-logo-red.png";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.navbar}>
      <div style={styles.navbarHeader}>
        <img
          src={logoImg}
          alt="Car Tunning AI Logo"
          style={styles.navbarLogo}
        />
        <h2 style={styles.navbarTitle}>Car Tunning AI</h2>
      </div>
      <div style={styles.navList}>
        <Link
          to="/"
          style={{
            ...styles.navItem,
            ...(isActive("/") ? styles.navItemActive : {}),
          }}
        >
          Home
        </Link>
        <Link
          to="/generate"
          style={{
            ...styles.navItem,
            ...(isActive("/generate") ? styles.navItemActive : {}),
          }}
        >
          Generate Images
        </Link>
        <Link
          to="/edit"
          style={{
            ...styles.navItem,
            ...(isActive("/edit") ? styles.navItemActive : {}),
          }}
        >
          Edit Images
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
