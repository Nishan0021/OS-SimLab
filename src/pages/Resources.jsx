import "./Resources.css";

export default function Resources() {
  return (
    <div className="resources-container">

      <h1 className="resources-title">Educational Resources</h1>
      <p className="resources-subtitle">
        Learn about OS algorithms and concepts
      </p>


      {/* CPU Scheduling */}
      <section className="resource-section">

        <h2>CPU Scheduling Algorithms</h2>

        <div className="card-grid">

          <div className="resource-card">
            <h3>First Come First Serve (FCFS)</h3>
            <p>
              Processes are executed in the order they arrive.
              Non-preemptive scheduling algorithm.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Simple to implement</li>
              <li>No starvation</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Convoy effect</li>
              <li>High waiting time</li>
            </ul>
          </div>


          <div className="resource-card">
            <h3>Shortest Job First (SJF)</h3>
            <p>
              Process with the shortest burst time is executed first.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Minimum average waiting time</li>
              <li>Efficient scheduling</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Starvation possible</li>
              <li>Burst time must be known</li>
            </ul>
          </div>


          <div className="resource-card">
            <h3>Round Robin (RR)</h3>
            <p>
              Each process gets a fixed time quantum in cyclic order.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Fair allocation</li>
              <li>Good response time</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Context switching overhead</li>
              <li>Performance depends on time quantum</li>
            </ul>
          </div>

        </div>
      </section>



      {/* Page Replacement */}
      <section className="resource-section">

        <h2>Page Replacement Algorithms</h2>

        <div className="card-grid">

          <div className="resource-card">
            <h3>FIFO (First In First Out)</h3>
            <p>
              Replaces the oldest page in memory. 
              Simple queue-based approach the page that has been in memory the longest is replaced first.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Simple to implement</li>
              <li>Low overhead</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Slow processing</li>
              <li>Doesn't consider page usage frequency</li>
            </ul>
          </div>

          <div className="resource-card">
            <h3>LRU (Least Recently Used)</h3>
            <p>
              Replaces the page that has not been used for the longest period of time.
              It is based on the principle of temporal locality.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Provides good performance in most cases</li>
              <li>Does not suffer from Belady’s anomaly</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Expensive to implement</li>
              <li>Requires tracking of page access history</li>
            </ul>
          </div>

          <div className="resource-card">
            <h3>Optimal (OPT)</h3>
            <p>
              Replaces the page that will not be used for the longest period of time in the future.
              It is theoretically the best algorithm and is used as a benchmark for comparison.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Lowest number of page faults</li>
              <li>Best for comparison (benchmark)</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Cannot be implemented in practice</li>
              <li>Requires future knowledge of page references</li>
            </ul>
          </div>

        </div>

      </section>



      {/* Memory Management */}
      <section className="resource-section">

        <h2>Memory Management</h2>

        <div className="card-grid">

          <div className="resource-card">
            <h3>First Fit</h3>
            <p>
              First Fit allocates the first memory block that is large enough to satisfy the request. 
              It scans memory from the beginning and selects the first suitable block
            </p>

            <b>Advantages</b>
            <ul>
              <li>Fast allocation</li>
              <li>Simple method</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Causes external fragmentation</li>
              <li>May waste memory space</li>
            </ul>
          </div>

          <div className="resource-card">
            <h3>Best Fit</h3>
            <p>
              Best Fit allocates the smallest memory block that is sufficient for the request. It searches all blocks and chooses the closest size to reduce wastage.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Minimizes wasted space</li>
              <li>Better memory utilization</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Slow allocation</li>
              <li>Creates small fragments</li>
            </ul>
          </div>

          <div className="resource-card">
            <h3>Worst Fit</h3>
            <p>
              Worst Fit allocates the largest available memory block. 
              It searches all blocks and selects the largest one that is sufficient for the request.
            </p>

            <b>Advantages</b>
            <ul>
              <li>Leaves large free blocks</li>
              <li>Useful for future allocation</li>
            </ul>

            <b>Disadvantages</b>
            <ul className="dis">
              <li>Wastes large memory blocks</li>
              <li>Poor performance</li>
            </ul>
          </div>

        </div>

      </section>


    </div>
  );
}
