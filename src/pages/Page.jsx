import { useState, useRef } from "react";
import "./Page.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Page() {

  const resultRef = useRef();

  const [algo, setAlgo] = useState("FIFO");

  const [refString, setRefString] =
    useState("");

  const [frames, setFrames] =
    useState("");

  const [result, setResult] =
    useState(null);


  // ---------- Parse ----------
  function parseRef() {

    return refString
      .trim()
      .split(/[ ,]+/)
      .map(Number)
      .filter(
        n => !isNaN(n)
      );

  }


  // ---------- FIFO ----------
  function runFIFO(ref, frameCount) {

    let memory =
      new Array(frameCount).fill(null);

    let pointer = 0;

    let faults = 0;
    let hits = 0;

    let table = [];

    ref.forEach((page, step) => {

      let hit =
        memory.includes(page);

      let changed = -1;

      if (hit) {

        hits++;

        changed =
          memory.indexOf(page);

      }

      else {

        faults++;

        changed = pointer;

        memory[pointer] = page;

        pointer =
          (pointer + 1) % frameCount;

      }

      table.push({

        step: step + 1,
        page,
        frames: [...memory],
        changed,
        result:
          hit ? "Hit" : "Fault"

      });

    });

    return {
      table,
      faults,
      hits
    };

  }


  // ---------- LRU ----------
  function runLRU(ref, frameCount) {

    let memory = [];

    let faults = 0;
    let hits = 0;

    let table = [];

    ref.forEach((page, step) => {

      let index =
        memory.indexOf(page);

      let changed = -1;

      if (index !== -1) {

        hits++;

        memory.splice(index, 1);

        memory.push(page);

        changed =
          memory.length - 1;

      }

      else {

        faults++;

        if (
          memory.length <
          frameCount
        ) {

          memory.push(page);

          changed =
            memory.length - 1;

        }

        else {

          memory.shift();

          memory.push(page);

          changed =
            memory.length - 1;

        }

      }

      let frameArr =
        new Array(frameCount).fill(null);

      memory.forEach(
        (p, i) =>
          frameArr[i] = p
      );

      table.push({

        step: step + 1,
        page,
        frames: frameArr,
        changed,
        result:
          index !== -1
            ? "Hit"
            : "Fault"

      });

    });

    return {
      table,
      faults,
      hits
    };

  }


  // ---------- OPTIMAL ----------
  function runOPT(ref, frameCount) {

    let memory = [];

    let faults = 0;
    let hits = 0;

    let table = [];

    ref.forEach((page, i) => {

      let hit =
        memory.includes(page);

      let changed = -1;

      if (hit) {

        hits++;

        changed =
          memory.indexOf(page);

      }

      else {

        faults++;

        if (
          memory.length <
          frameCount
        ) {

          memory.push(page);

          changed =
            memory.length - 1;

        }

        else {

          let index = -1;

          let farthest = -1;

          memory.forEach(
            (m, idx) => {

              let next =
                ref
                  .slice(i + 1)
                  .indexOf(m);

              if (next === -1) {

                index = idx;

                return;

              }

              if (next > farthest) {

                farthest = next;

                index = idx;

              }

            });

          memory[index] = page;

          changed = index;

        }

      }

      let frameArr =
        new Array(frameCount).fill(null);

      memory.forEach(
        (p, i) =>
          frameArr[i] = p
      );

      table.push({

        step: i + 1,
        page,
        frames: frameArr,
        changed,
        result:
          hit ? "Hit" : "Fault"

      });

    });

    return {
      table,
      faults,
      hits
    };

  }


  // ---------- RUN ----------
  function run() {

    let ref =
      parseRef();

    if (
      !ref.length ||
      !frames
    ) {

      alert(
        "Enter reference string and frame count"
      );

      return;

    }

    let res;

    if (algo === "FIFO")
      res =
        runFIFO(
          ref,
          frames
        );

    else if (algo === "LRU")
      res =
        runLRU(
          ref,
          frames
        );

    else
      res =
        runOPT(
          ref,
          frames
        );

    let faultRate =
      (
        (res.faults /
          ref.length) *
        100
      ).toFixed(1);

    setResult({

      ...res,
      total:
        ref.length,
      faultRate

    });

  }


  // ---------- REFRESH ----------
  function refresh() {

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
      "Page_Replacement_Result.pdf"
    );

  }


  // ---------- UI ----------
  return (

    <div className="page-container">

      <h1>
        Page Replacement Simulator
      </h1>

      <p>
        Simulate FIFO, LRU, Optimal
      </p>


      {/* ALGO */}

      <div className="algo-box">

        {[
          "FIFO",
          "LRU",
          "OPT"
        ].map(a => (

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


      {/* REF STRING */}

      <div className="input-box">

        <label>
          Reference String
        </label>

        <input
          value={refString}
          onChange={(e) =>
            setRefString(
              e.target.value
            )
          }
        />

        <small>
          {
            parseRef().length
          } pages
        </small>

      </div>


      {/* FRAME */}

      <div className="input-box">

        <label>
          Frame Count
        </label>

        <input
          type="number"
          value={frames}
          onChange={(e) =>
            setFrames(
              Number(
                e.target.value
              )
            )
          }
        />

      </div>


      {/* BUTTONS */}

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


      {/* RESULT */}

      {result && (

        <div
          ref={resultRef}
        >

          <div className="stats">

            <div className="card fault">
              {result.faults}
              <span>
                Page Faults
              </span>
            </div>

            <div className="card hit">
              {result.hits}
              <span>
                Page Hits
              </span>
            </div>

            <div className="card rate">
              {result.faultRate}%
              <span>
                Fault Rate
              </span>
            </div>

          </div>


          <table>

            <thead>

              <tr>

                <th>Step</th>
                <th>Page</th>

                {Array.from(
                  { length: frames }
                ).map((_, i) => (

                  <th key={i}>
                    F{i + 1}
                  </th>

                ))}

                <th>Result</th>

              </tr>

            </thead>


            <tbody>

              {result.table.map(
                (row, i) => (

                  <tr key={i}>

                    <td>
                      {row.step}
                    </td>

                    <td>
                      {row.page}
                    </td>

                    {row.frames.map(
                      (f, j) => (

                        <td key={j}>

                          <div
                            className={
                              j === row.changed
                                ? "frame changed"
                                : "frame"
                            }
                          >
                            {f ?? "-"}
                          </div>

                        </td>

                      )
                    )}

                    <td>

                      <span
                        className={
                          row.result === "Hit"
                            ? "hit-badge"
                            : "fault-badge"
                        }
                      >
                        {row.result}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

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
