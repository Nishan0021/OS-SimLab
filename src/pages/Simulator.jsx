import "./Simulator.css";
import { useNavigate } from "react-router-dom";

export default function Simulator() {

  const navigate = useNavigate();

  return (

    <div className="sim-container">

      <h1>Simulator</h1>

      <p>Select an Operating System simulator</p>


      <div className="sim-grid">

        <div
          className="sim-card"
          onClick={() => navigate("/cpu")}
        >
          <h2>CPU Scheduling</h2>
          <p>
            Simulate FCFS, SJF, and Round Robin algorithms
          </p>
        </div>


        <div
          className="sim-card"
          onClick={() => navigate("/memory")}
        >
          <h2>Memory Management</h2>
          <p>
            Simulate First Fit, Best Fit, and Worst Fit allocation
          </p>
        </div>


        <div
          className="sim-card"
          onClick={() => navigate("/page")}
        >
          <h2>Page Replacement</h2>
          <p>
            Simulate FIFO, LRU, and Optimal algorithms
          </p>
        </div>


      </div>

    </div>

  );

}
