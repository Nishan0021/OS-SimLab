import { useState, useRef } from "react";
import "./CPU.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const colors = ["#2f55d4", "#20b27a", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function CPU() {

  const resultRef = useRef();

  const [algo, setAlgo] = useState("FCFS");
  const [quantum, setQuantum] = useState("");

  const [processes, setProcesses] = useState([
    { id: "P1", arrival: "", burst: "" },
    { id: "P2", arrival: "", burst: "" },
  ]);

  const [result, setResult] = useState(null);

  // ---------- FCFS ----------
  function runFCFS(list) {

    let time = 0;
    let table = [];
    let gantt = [];

    list
      .sort((a, b) => a.arrival - b.arrival)
      .forEach((p) => {

        if (time < p.arrival)
          time = p.arrival;

        let start = time;

        time += p.burst;

        gantt.push({
          id: p.id,
          start,
          end: time,
        });

        table.push({
          ...p,
          completion: time,
          turnaround: time - p.arrival,
          waiting: time - p.arrival - p.burst,
        });

      });

    return { table, gantt, totalTime: time };

  }

  // ---------- SJF ----------
  function runSJF(list) {

    let time = 0;
    let done = [];
    let gantt = [];

    list = [...list];

    while (done.length < list.length) {

      let ready = list.filter(
        (p) =>
          !done.includes(p.id) &&
          p.arrival <= time
      );

      if (ready.length === 0) {
        time++;
        continue;
      }

      ready.sort((a, b) => a.burst - b.burst);

      let p = ready[0];

      let start = time;

      time += p.burst;

      gantt.push({
        id: p.id,
        start,
        end: time,
      });

      done.push(p.id);

      p.completion = time;
      p.turnaround = time - p.arrival;
      p.waiting = p.turnaround - p.burst;

    }

    return { table: list, gantt, totalTime: time };

  }

  // ---------- ROUND ROBIN ----------
  function runRR(list, q) {

    if (!q || q <= 0)
      return null;

    let time = 0;

    let queue = [];

    let gantt = [];

    let remaining = {};

    let table = list.map(p => ({ ...p }));

    table.forEach(p => {
      remaining[p.id] = p.burst;
    });

    while (true) {

      list.forEach(p => {

        if (p.arrival === time)
          queue.push(p.id);

      });

      if (queue.length === 0) {

        if (Object.values(remaining).every(v => v === 0))
          break;

        time++;
        continue;

      }

      let pid = queue.shift();

      let exec = Math.min(q, remaining[pid]);

      gantt.push({
        id: pid,
        start: time,
        end: time + exec,
      });

      time += exec;

      remaining[pid] -= exec;

      list.forEach(p => {

        if (
          p.arrival > time - exec &&
          p.arrival <= time
        )
          queue.push(p.id);

      });

      if (remaining[pid] > 0)
        queue.push(pid);

      else {

        let proc = table.find(p => p.id === pid);

        proc.completion = time;

      }

    }

    table.forEach(p => {

      p.turnaround = p.completion - p.arrival;

      p.waiting =
        p.turnaround - p.burst;

    });

    return { table, gantt, totalTime: time };

  }

  // ---------- RUN ----------
  function run() {

    const clean = processes
      .filter(
        p =>
          p.arrival !== "" &&
          p.burst !== ""
      )
      .map(p => ({
        ...p,
        arrival: Number(p.arrival),
        burst: Number(p.burst),
      }));

    if (clean.length === 0)
      return;

    let res;

    if (algo === "FCFS")
      res = runFCFS(clean);

    else if (algo === "SJF")
      res = runSJF(clean);

    else
      res = runRR(clean, Number(quantum));

    if (!res)
      return;

    let avgW =
      res.table.reduce(
        (s, p) => s + p.waiting,
        0
      ) / res.table.length;

    let avgT =
      res.table.reduce(
        (s, p) => s + p.turnaround,
        0
      ) / res.table.length;

    setResult({
      ...res,
      avgW,
      avgT,
    });

  }

  // ---------- REFRESH ----------
  function refresh() {

    setProcesses([
      { id: "P1", arrival: "", burst: "" },
      { id: "P2", arrival: "", burst: "" },
    ]);

    setQuantum("");

    setResult(null);

  }

  // ---------- EXPORT PDF ----------
  async function exportPDF() {

    const element =
      resultRef.current;

    const canvas =
      await html2canvas(element);

    const img =
      canvas.toDataURL("image/png");

    const pdf =
      new jsPDF();

    pdf.addImage(
      img,
      "PNG",
      10,
      10,
      190,
      0
    );

    pdf.save(
      "CPU_Scheduling_Result.pdf"
    );

  }

  // ---------- UI ----------
  return (

    <div className="cpu-container">

      <h1>
        CPU Scheduling Simulator
      </h1>

      <p>
        Simulate FCFS, SJF, and Round Robin
      </p>

      {/* Algorithm buttons */}

      <div className="algo-box">

        {["FCFS", "SJF", "RR"].map(a => (

          <button
            key={a}
            className={
              algo === a
                ? "active"
                : ""
            }
            onClick={() =>
              setAlgo(a)
            }
          >
            {a}
          </button>

        ))}

      </div>

      {/* Quantum */}

      {algo === "RR" && (

        <div className="quantum-box">

          <label>
            Time Quantum
          </label>

          <input
            type="number"
            value={quantum}
            onChange={(e) =>
              setQuantum(
                e.target.value
              )
            }
          />

        </div>

      )}

      {/* Process input */}

      <div className="process-box">

        <h3>Processes</h3>

        <div className="process-header">

          <span>ID</span>
          <span>Arrival</span>
          <span>Burst</span>

        </div>

        {processes.map((p, i) => (

          <div
            key={i}
            className="process-row"
          >

            <span className="pid">
              {p.id}
            </span>

            <input
              type="number"
              placeholder="Arrival"
              value={p.arrival}
              onChange={(e) => {

                const copy =
                  [...processes];

                copy[i].arrival =
                  e.target.value;

                setProcesses(copy);

              }}
            />

            <input
              type="number"
              placeholder="Burst"
              value={p.burst}
              onChange={(e) => {

                const copy =
                  [...processes];

                copy[i].burst =
                  e.target.value;

                setProcesses(copy);

              }}
            />

            <button
              className="delete-btn"
              onClick={() =>
                setProcesses(
                  processes.filter(
                    (_, idx) =>
                      idx !== i
                  )
                )
              }
            >
              ✕
            </button>

          </div>

        ))}

        <button
          className="add-btn"
          onClick={() =>
            setProcesses([
              ...processes,
              {
                id:
                  "P" +
                  (processes.length +
                    1),
                arrival: "",
                burst: "",
              },
            ])
          }
        >
          + Add Process
        </button>

      </div>

      {/* Run + Refresh */}

      <div className="run-row">

        <button
          className="run-btn"
          onClick={run}
        >
          ▶ Run
        </button>

        <button
          className="refresh-btn"
          onClick={refresh}
        >
          ↻
        </button>

      </div>

      {/* RESULTS */}

      {result && (

        <div
          className="result-box"
          ref={resultRef}
        >

          <h3>Gantt Chart</h3>

          <div className="gantt">

            {result.gantt.map(
              (g, i) => (

                <div
                  key={i}
                  className="gantt-block"
                  style={{
                    background:
                      colors[
                        i %
                          colors.length
                      ],
                    flex:
                      g.end -
                      g.start,
                  }}
                >
                  {g.id}
                </div>

              )
            )}

          </div>

          <div className="timeline">

            {result.gantt.map(
              (g, i) => (
                <span key={i}>
                  {g.start}
                </span>
              )
            )}

            <span>
              {result.totalTime}
            </span>

          </div>

          <div className="stats">

            <div className="stat-card">

              <h2>
                {result.avgW.toFixed(
                  2
                )}
              </h2>

              <p>
                Avg Waiting
              </p>

            </div>

            <div className="stat-card">

              <h2>
                {result.avgT.toFixed(
                  2
                )}
              </h2>

              <p>
                Avg Turnaround
              </p>

            </div>

            <div className="stat-card">

              <h2>
                {result.totalTime}
              </h2>

              <p>Total Time</p>

            </div>

          </div>

          <button
            className="export-btn"
            onClick={exportPDF}
          >
            Export PDF
          </button>

        </div>

      )}

    </div>

  );

}
