import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
function Layout() {
  return (
    <div className="container">
      <div className="app-layout">
        <Navbar />
        <main id="main-content-area" className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
