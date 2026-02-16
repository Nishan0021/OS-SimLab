import { useState, useRef } from "react";
import "./Memory.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const colors = ["#2f55d4", "#20b27a", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Memory() {

  const resultRef = useRef();

  const [blocksInput, setBlocksInput] = useState("");
  const [processInput, setProcessInput] = useState("");
  const [algo, setAlgo] = useState("FIRST");
  const [result, setResult] = useState(null);

  // ---------- Parse ----------
  function parse(text) {

    return text
      .trim()
      .split(/[ ,]+/)
      .map(Number)
      .filter(n => !isNaN(n));

  }

  // ---------- Refresh ----------
  function refresh() {

    setBlocksInput("");
    setProcessInput("");
    setResult(null);

  }

  // ---------- Allocation ----------
  function allocate() {

    let blocks = parse(blocksInput);
    let processes = parse(processInput);

    if (!blocks.length || !processes.length) {

      alert("Enter Memory Blocks and Processes");
      return;

    }

    // clone blocks
    let freeBlocks = blocks.map((size, index) => ({
      size,
      index,
      used: false
    }));

    let table = [];
    let visual = [];

    processes.forEach((pSize, i) => {

      let chosenBlock = null;

      // FIRST FIT
      if (algo === "FIRST") {

        chosenBlock = freeBlocks.find(
          block =>
            !block.used &&
            block.size >= pSize
        );

      }

      // BEST FIT
      else if (algo === "BEST") {

        let possible =
          freeBlocks.filter(
            block =>
              !block.used &&
              block.size >= pSize
          );

        if (possible.length > 0) {

          chosenBlock =
            possible.reduce(
              (best, block) =>
                block.size < best.size
                  ? block
                  : best
            );

        }

      }

      // WORST FIT
      else if (algo === "WORST") {

        let possible =
          freeBlocks.filter(
            block =>
              !block.used &&
              block.size >= pSize
          );

        if (possible.length > 0) {

          chosenBlock =
            possible.reduce(
              (worst, block) =>
                block.size > worst.size
                  ? block
                  : worst
            );

        }

      }

      // ---------- Allocation ----------
      if (chosenBlock) {

        chosenBlock.used = true;

        let frag =
          chosenBlock.size - pSize;

        table.push({

          process: "P" + (i + 1),
          size: pSize,
          block:
            chosenBlock.index + 1,
          frag

        });

        visual.push({

          process: "P" + (i + 1),
          processSize: pSize,
          blockSize:
            chosenBlock.size,
          frag,
          color:
            colors[
              i % colors.length
            ]

        });

      }

      else {

        table.push({

          process: "P" + (i + 1),
          size: pSize,
          block: "Not Allocated",
          frag: 0

        });

      }

    });

    let totalFrag =
      table.reduce(
        (sum, p) => sum + p.frag,
        0
      );

    setResult({

      table,
      visual,
      totalFrag,
      blocks,
      processes

    });

  }

  // ---------- Export PDF ----------
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
      "Memory_Allocation_Result.pdf"
    );

  }

  // ---------- UI ----------
  return (

    <div className="mem-container">

      <h1>
        Memory Allocation Simulator
      </h1>

      <p className="subtitle">
        Simulate First Fit, Best Fit, Worst Fit
      </p>

      {/* INPUT */}

      <div className="input-row">

        <input
          placeholder="Memory Blocks (example: 25 30 50 100 10)"
          value={blocksInput}
          onChange={(e) =>
            setBlocksInput(
              e.target.value
            )
          }
        />

        <input
          placeholder="Processes (example: 10 18 40 60)"
          value={processInput}
          onChange={(e) =>
            setProcessInput(
              e.target.value
            )
          }
        />

      </div>

      {/* ALGORITHM */}

      <div className="algo-row">

        {[
          "FIRST",
          "BEST",
          "WORST"
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
            {a} FIT
          </button>

        ))}

      </div>

      {/* BUTTONS */}

      <div className="run-row">

        <button
          className="run-btn"
          onClick={allocate}
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
          className="result-box"
          ref={resultRef}
        >

          <h3>
            Memory Visualization
          </h3>

          <div className="memory-bar">

            {result.visual.map(
              (v, i) => (

                <div
                  key={i}
                  className="memory-block"
                >

                  <div
                    className="process"
                    style={{
                      background:
                        v.color,
                      flex:
                        v.processSize
                    }}
                  >
                    {v.process}
                  </div>

                  {v.frag > 0 && (

                    <div
                      className="frag"
                      style={{
                        flex: v.frag
                      }}
                    >
                      {v.frag}K
                    </div>

                  )}

                </div>

              )
            )}

          </div>

          <h3>
            Allocation Table
          </h3>

          <table>

            <thead>

              <tr>

                <th>Process</th>
                <th>Size</th>
                <th>Block</th>
                <th>Fragment</th>

              </tr>

            </thead>

            <tbody>

              {result.table.map(
                (row, i) => (

                  <tr key={i}>

                    <td>
                      {row.process}
                    </td>

                    <td>
                      {row.size}K
                    </td>

                    <td>
                      {row.block}
                    </td>

                    <td>
                      {row.frag}K
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          <div className="total-frag">

            Total Fragmentation:
            {result.totalFrag}K

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
