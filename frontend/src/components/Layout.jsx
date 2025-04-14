import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="container">
      <div className="app-layout">
        <Navbar />
        <main id="main-content-area" className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
