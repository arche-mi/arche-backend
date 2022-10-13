import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";

function App() {
  return (
    <div className="App">
      <div className="app">
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />   
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
