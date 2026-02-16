import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="logo">💻</div>
        <div className="title">OS SimLab</div>
      </div>

      <div className="nav-right">
        <Link
          to="/"
          className={location.pathname === "/" ? "nav-link active" : "nav-link"}
        >
          Dashboard
        </Link>

        <Link
          to="/cpu"
          className={location.pathname === "/cpu" ? "nav-link active" : "nav-link"}
        >
          CPU Scheduling
        </Link>

        <Link
          to="/memory"
          className={location.pathname === "/memory" ? "nav-link active" : "nav-link"}
        >
          Memory Management
        </Link>

        <Link
          to="/page"
          className={location.pathname === "/page" ? "nav-link active" : "nav-link"}
        >
          Page Replacement
        </Link>
      </div>
    </div>
  );
}
