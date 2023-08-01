import React, { useState, useEffect } from "react";
import ProgressBar from "react-progressbar";
import "./QuizGame.css";

const QuizGame = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30); // 타이머 초기 값 (30초로 변경)
  const [showHint, setShowHint] = useState(false);

  const [shuffledQuizData, setShuffledQuizData] = useState([]);

  useEffect(() => {
    setShuffledQuizData(shuffleArray(quizData));
  }, [quizData]);

  useEffect(() => {
    if (showResult) {
      return; // 결과가 보여지는 동안 타이머를 멈추지 않도록 처리
    }

    if (remainingTime > 0) {
      // 1초마다 타이머 갱신
      const timer = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      // 컴포넌트 언마운트 시 타이머 클리어
      return () => clearTimeout(timer);
    } else {
      // 제한 시간이 다 되면 다음 문제로 넘어가기
      goToNextQuestion();
    }
  }, [remainingTime, showResult]);

  const currentQuestion = shuffledQuizData[currentQuestionIndex];

  const handleAnswer = (selectedAnswer) => {
    if (showResult) {
      goToNextQuestion();
    } else {
      setUserAnswer(selectedAnswer);

      const currentQuestion = shuffledQuizData[currentQuestionIndex];

      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore((prevScore) => prevScore + 1);
      }

      setShowResult(true);

      setTimeout(() => {
        goToNextQuestion();
      }, 2000);
    }
  };

  const renderScore = () => {
    return <div className="score">점수: {score}</div>;
  };

  const goToNextQuestion = () => {
    setUserAnswer("");
    setShowResult(false);
    setRemainingTime(30); // 다음 문제로 넘어가기 전에 타이머 초기화 (30초로 변경)
    setShowHint(false);

    if (currentQuestionIndex + 1 < shuffledQuizData.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // 모든 문제가 끝났을 때 점수 보여주기
      alert(`퀴즈가 종료되었습니다! 당신의 점수는 ${score}점 입니다.`);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShuffledQuizData(shuffleArray(quizData));
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) {
      return null;
    }

    return (
      <div className="question-container">
        <h2 className="question-title">{currentQuestion.question}</h2>

        {/* 시간 제한 프로그레스 바 */}
        <div className="time-bar-container">
          <ProgressBar completed={(remainingTime / 30) * 100} color="#9b59b6" height="20px" />
        </div>

        <ul className="options-list">
          {currentQuestion.options.map((option, index) => (
            <li key={index}>
              <button
                className={`option-button ${
                  userAnswer === option ? (userAnswer === currentQuestion.correctAnswer ? "correct-answer" : "incorrect-answer") : ""
                }`}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>

        {/* 힌트 버튼 추가 */}
        {showHint && <p className="hint">{currentQuestion.hint}</p>}
        <button className="hint-button" onClick={() => setShowHint(true)} disabled={showHint}>
          Hint
        </button>
      </div>
    );
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    let currentIndex = shuffledArray.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
    }

    return shuffledArray;
  };

  return (
    <div className="quiz-game-container">
      {renderScore()}
      {renderQuestion()}
      {showResult && (
        <p className={userAnswer === currentQuestion.correctAnswer ? "correct-answer" : "incorrect-answer"}>
          {userAnswer === currentQuestion.correctAnswer ? "정답입니다!" : `오답입니다. 정답은: ${currentQuestion.correctAnswer}`}
        </p>
      )}
    </div>
  );
};

export default QuizGame;
