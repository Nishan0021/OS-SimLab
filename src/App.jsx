import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Cpu from "./pages/CPU";
import Memory from "./pages/Memory";
import PageSim from "./pages/Page";
import Deadlock from "./pages/Deadlock";

function App() {
  return (
    <>
      {/* Navbar ALWAYS visible */}
      <Navbar />

      {/* Page content changes */}
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/cpu" element={<Cpu />} />

        <Route path="/memory" element={<Memory />} />

        <Route path="/page" element={<PageSim />} />

        <Route path="/deadlock" element={<Deadlock />} />

      </Routes>
    </>
  );
}

export default App;
