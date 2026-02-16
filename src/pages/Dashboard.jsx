import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      <div className="hero">

        <div className="hero-badge">
          Interactive OS Concepts
        </div>

        <h1>
          Learn Operating Systems <br />
          <span className="highlight">by Doing</span>
        </h1>

        <p>
          Visualize CPU scheduling, memory management, and page replacement
          algorithms with step-by-step simulations and real-time analytics.
        </p>

        <div className="hero-buttons">

          <button
            className="start-btn"
            onClick={() => navigate("/cpu")}
          >
            ▶ Start Simulating
          </button>

          <button
            className="learn-btn"
            onClick={() => navigate("/memory")}
          >
            📘 Learn More
          </button>

        </div>

      </div>

    </div>
  );
}
