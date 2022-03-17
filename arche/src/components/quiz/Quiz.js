import React, { useState } from "react";
import quizData from "./quizData.json";

const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = quizData.quiz[currentIndex];
  const options = currentQuestion.options;
  const answer = currentQuestion.answer;

  const handleOptionClick = (e) => {
    setShowAnswer(true);
    if (parseInt(e.target.id) === answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setShowAnswer(false);
  };

  return (
    <div>
      {currentIndex < quizData.quiz.length ? (
        <>
          <h3>{currentQuestion.question}</h3>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name="option"
                id={index}
                onClick={handleOptionClick}
              />
              <label htmlFor={index}>{option}</label>
            </div>
          ))}
          {showAnswer ? (
            <>
              <p>
                {answer === answer
                  ? "Correct!"
                  : "Incorrect."}
              </p>
              <button onClick={handleNextClick}>Next</button>
            </>
          ) : null}
        </>
      ) : (
        <>
          <h3>Quiz completed!</h3>
          <p>Your final score is {score}/{quizData.quiz.length}.</p>
        </>
      )}
    </div>
  );
};

export default Quiz;