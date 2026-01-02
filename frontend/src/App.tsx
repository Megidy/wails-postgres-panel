import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Query from "./pages/Query";
import { Navbar } from "./components/Navbar";
import { Connections } from "./pages/Connections";

function App() {
  return (
    <Router>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connection/:id/query" element={<Query />} />
        <Route path="/connections" element={<Connections />} />
      </Routes>
    </Router>
  );
}

export default App;
