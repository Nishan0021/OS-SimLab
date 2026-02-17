import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Simulator from "./pages/Simulator";
import About from "./pages/About";
import Cpu from "./pages/CPU";
import Memory from "./pages/Memory";
import PageSim from "./pages/Page";

/* ADD THIS IMPORT */
import Resources from "./pages/Resources";

function App() {
  return (
    <>
      {/* Navbar ALWAYS visible */}
      <Navbar />

      {/* Page content changes */}
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/simulator" element={<Simulator />} />

        <Route path="/about" element={<About />} />

        <Route path="/cpu" element={<Cpu />} />

        <Route path="/memory" element={<Memory />} />

        <Route path="/page" element={<PageSim />} />

        {/* ADD THIS ROUTE */}
        <Route path="/resources" element={<Resources />} />

      </Routes>
    </>
  );
}

export default App;
