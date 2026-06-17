import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InterviewSession = () => {
  const navigate = useNavigate();

  const questions =
    JSON.parse(
      localStorage.getItem("questions")
    ) || [];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] =
    useState([]);

  const nextQuestion = () => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] =
      answer;

    setAnswers(updatedAnswers);

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );

      setAnswer("");
    } else {
      localStorage.setItem(
        "answers",
        JSON.stringify(updatedAnswers)
      );

      navigate("/results");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
      }}
    >
      <h1>Interview Session</h1>

      <h2>
        Question {currentQuestion + 1}
      </h2>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {questions[currentQuestion]}
      </div>

      <br />

      <textarea
        rows="8"
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button onClick={nextQuestion}>
        Next Question
      </button>
    </div>
  );
};

export default InterviewSession;  