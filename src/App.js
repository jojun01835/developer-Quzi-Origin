import React from "react";
import QuizGame from "./QuizGame";
import quizData from "./data.json"; // 여기서 quizData를 import 해오거나, 필요한 데이터를 다른 방법으로 가져올 수 있습니다.

const App = () => {
  return <QuizGame quizData={quizData} />;
};

export default App;
