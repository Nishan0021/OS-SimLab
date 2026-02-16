import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  return (
    <div className="navbar">

      <div className="nav-left">
        <span className="nav-logo">💻</span>
        <span>OS SimLab</span>
      </div>

      <div className="nav-right">

        <NavLink to="/" className="nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/cpu" className="nav-link">
          CPU Scheduling
        </NavLink>

        <NavLink to="/memory" className="nav-link">
          Memory Management
        </NavLink>

        <NavLink to="/page" className="nav-link">
          Page Replacement
        </NavLink>

      </div>

    </div>
  );

}
