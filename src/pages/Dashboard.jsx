import "./Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <div className="hero">

        <div className="badge">
          Interactive OS Concepts
        </div>

        <h1>
          Learn Operating Systems
          <br />
          <span>by Doing</span>
        </h1>

        <p>
          Visualize CPU scheduling, memory management,
          and page replacement algorithms with step-by-step
          simulations and real-time analytics.
        </p>

        <div className="buttons">

          <Link to="/cpu" className="start-btn">
            ▶ Start Simulating
          </Link>

          <button className="learn-btn">
            📘 Learn More
          </button>

        </div>

      </div>

    </div>
  );
}
