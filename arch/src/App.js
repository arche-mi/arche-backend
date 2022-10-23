import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Sign from "./components/sign/Sign";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import CreateQuestion from "./components/question/CreateQuestion";
import ReadQuestion from "./components/question/ReadQuestion";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />   
          <Route exact path="/landing" element={<Landing />} />   
          <Route exact path="/sign" element={<Sign />} />
          <Route exact path="/users" element={<Dashboard />} />
          <Route exact path="/question/new" element={<CreateQuestion />} />
          <Route exact path="/question" element={<ReadQuestion />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;