import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Feeds from "./pages/Feeds";
import Drafts from "./pages/Drafts";
import Queue from "./pages/Queue";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feeds" element={<Feeds />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/queue" element={<Queue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
