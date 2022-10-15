import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Sign from "./components/sign/Sign";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />   
          <Route exact path="/sign" element={<Sign />} />
          <Route exact path="/users" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;