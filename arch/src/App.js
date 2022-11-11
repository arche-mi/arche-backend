import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Sign from "./components/sign/Sign";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import CreateQuestion from "./components/question/CreateQuestion";
import ReadQuestion from "./components/question/ReadQuestion";
import Feedback from "./components/feedback/Feedback"
import Donation from "./components/donation/Donation";
import Users from "./components/users/Users"
import Blog from "./components/blog/Blog"


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />   
          <Route exact path="/blog" element={<Blog />} />   
          <Route exact path="/landing" element={<Landing />} />   
          <Route exact path="/sign" element={<Sign />} />
          <Route exact path="/user" element={<Dashboard />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/question/new" element={<CreateQuestion />} />
          <Route exact path="/question" element={<ReadQuestion />} />
          <Route exact path="/feedback" element={<Feedback />} />
          <Route exact path="/donation" element={<Donation />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;