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
import Users from "./components/users/Users";
import Blog from "./components/blog/Blog";
import Questions from "./components/question/Questions";
import Unanswered from "./components/question/Unanswered";
import Librairie from "./components/librairie/Librairie";
import Badges from "./components/badges/Badge";
import Chat from "./components/chat/Chat";
import Privacy from "./components/privacyPolicy/privacyPolicy";
import NotFound from "./components/notFound/NotFound";
import Quiz from "./components/quiz/Quiz";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='*' element={<NotFound />}/>
          <Route exact path="/" element={<Questions />} />
          <Route exact path="/question/top" element={<Home />} />
          <Route exact path="/blog" element={<Blog />} />   
          <Route exact path="/quiz" element={<Quiz />} />   
          <Route exact path="/sign" element={<Sign />} />
          <Route exact path="/user" element={<Dashboard />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/question/new" element={<CreateQuestion />} />
          <Route exact path="/questions" element={<Questions />} />
          <Route exact path="/question" element={<ReadQuestion />} />
          <Route exact path="/unanswered" element={<Unanswered />} />
          <Route exact path="/feedback" element={<Feedback />} />
          <Route exact path="/donation" element={<Donation />} />
          <Route exact path="/librairie" element={<Librairie />} />
          <Route exact path="/badges" element={<Badges />} />
          <Route exact path="/Chat" element={<Chat />} />
          <Route exact path="/privacy-policy" element={<Privacy />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;