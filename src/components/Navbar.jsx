import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const location = useLocation();

  return (

    <nav className="navbar">

      {/* LEFT — TEXT LOGO */}
      <div className="nav-left">

        <Link to="/" className="logo-text">

          <span className="logo-os">OS</span>
          <span className="logo-simlab">SimLab</span>

        </Link>

      </div>


      {/* RIGHT — NAV LINKS */}
      <div className="nav-right">

        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/simulator"
          className={location.pathname === "/simulator" ? "active" : ""}
        >
          Simulator
        </Link>

        <Link
          to="/about"
          className={location.pathname === "/about" ? "active" : ""}
        >
          About
        </Link>

      </div>

    </nav>

  );

}
