import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { styles } from "../styles";

console.log(window.scrollY);

function Layout() {
  return (
    <div style={styles.container}>
      <div style={styles.appLayout}>
        <Navbar />
        <main id="main-content-area" style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
