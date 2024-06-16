import React, { useState, useEffect } from 'react';
import './App.css';
import questions from './questions.json';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(parseInt(localStorage.getItem('currentQuestion')) || 0);
  const [timeLeft, setTimeLeft] = useState(parseInt(localStorage.getItem('timeLeft')) || 600);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          localStorage.setItem('timeLeft', newTime);
          if (newTime <= 0) {
            clearInterval(timer);
            handleSubmitQuiz();
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted]);

  useEffect(() => {
    localStorage.setItem('currentQuestion', currentQuestion);
  }, [currentQuestion]);

  const handleAnswerOptionClick = (option) => {
    localStorage.setItem(`answer-${currentQuestion}`, option);
  };

  const handleStartQuiz = () => {
    if (!agreedToTerms) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    document.documentElement.requestFullscreen();
    setQuizStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let finalScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (localStorage.getItem(`answer-${i}`) === questions[i].answer) {
        finalScore++;
      }
    }
    setScore(finalScore);
    setQuizCompleted(true);
    setQuizStarted(false);
    document.exitFullscreen();
  };

  const handleAgreeToTerms = () => {
    setAgreedToTerms(!agreedToTerms);
  };

  useEffect(() => {
    const fullScreenChangeHandler = () => {
      if (!document.fullscreenElement) {
        alert('Full screen mode exited. Quiz will stop.');
        setQuizStarted(false);
        document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', fullScreenChangeHandler);

    return () => document.removeEventListener('fullscreenchange', fullScreenChangeHandler);
  }, []);

  if (quizCompleted) {
    return (
      <div className="result-screen">
        <h1>Thank you for completing the quiz!</h1>
        <p>Your score is {score} out of {questions.length}.</p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="start-screen">
        <h1>Welcome to the Quiz</h1>
        <div className="terms-conditions">
          <p>Please read and accept the terms and conditions before starting the quiz.</p>
          <textarea readOnly>
            {/* Add actual terms and conditions text here */}
            By participating in this quiz, you agree to comply with the rules and regulations set forth by the organizers. You understand that any form of cheating or dishonesty is prohibited and may result in disqualification. The quiz is intended for educational and entertainment purposes only.
          </textarea>
          <div className="terms-checkbox">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleAgreeToTerms}
            />
            <label>I agree to the terms and conditions</label>
          </div>
        </div>
        <button onClick={handleStartQuiz}>Start Quiz</button>
      </div>
    );
  }

  if (timeLeft <= 0) {
    return <div>Time's up! Please submit your answers.</div>;
  }

  return (
    <div className="app">
      <div className="question-section">
        <div className="question-count">
          <span>Question {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className="question-text">{questions[currentQuestion].question}</div>
      </div>
      <div className="answer-section">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              localStorage.getItem(`answer-${currentQuestion}`) === option ? 'selected' : ''
            }`}
            onClick={() => handleAnswerOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
          Previous
        </button>
        <button onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1}>
          Next
        </button>
        <button onClick={handleSubmitQuiz}>Submit</button>
      </div>
      <div className="timer">
        Time left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
      </div>
    </div>
  );
}

export default App;
