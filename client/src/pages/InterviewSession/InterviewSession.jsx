import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InterviewSession = () => {
  const navigate = useNavigate();

  const config = JSON.parse(
    localStorage.getItem("interviewConfig")
  );

  const questions = [
    "Tell me about yourself.",
    "What is React?",
    "Explain useState Hook.",
    "What is MongoDB?",
    "Describe your latest project.",
  ];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
    } else {
      alert("Interview Completed!");

      navigate("/results");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1>Interview Session</h1>

      <p>
        <strong>Role:</strong> {config?.role}
      </p>

      <p>
        <strong>Experience:</strong>{" "}
        {config?.experience} Years
      </p>

      <p>
        <strong>Difficulty:</strong>{" "}
        {config?.difficulty}
      </p>

      <h2>
        Question {currentQuestion + 1} of{" "}
        {questions.length}
      </h2>

      <div
        style={{
          padding: "15px",
          background: "#f5f5f5",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        {questions[currentQuestion]}
      </div>

      <textarea
        rows="8"
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        placeholder="Type your answer here..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <br />
      <br />

      <button
        onClick={nextQuestion}
        style={{
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Next Question
      </button>
    </div>
  );
};

export default InterviewSession;