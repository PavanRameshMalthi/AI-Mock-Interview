import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError } from "../../components/UI/Toast";

const InterviewSession = () => {
  const navigate = useNavigate();
  const questions = useMemo(
    () => JSON.parse(localStorage.getItem("questions") || "[]"),
    []
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    () => JSON.parse(localStorage.getItem("answers") || "[]")
  );
  const [answer, setAnswer] = useState(answers[0] || "");

  const current = questions[currentQuestion];
  const progress = questions.length
    ? Math.round(((currentQuestion + 1) / questions.length) * 100)
    : 0;

  const saveCurrentAnswer = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer.trim();
    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));
    return updatedAnswers;
  };

  const nextQuestion = () => {
    if (!answer.trim()) {
      showError("Add an answer before moving on");
      return;
    }

    const updatedAnswers = saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setAnswer(updatedAnswers[nextIndex] || "");
      return;
    }

    navigate("/results");
  };

  const previousQuestion = () => {
    const updatedAnswers = saveCurrentAnswer();
    const previousIndex = currentQuestion - 1;
    setCurrentQuestion(previousIndex);
    setAnswer(updatedAnswers[previousIndex] || "");
  };

  if (!questions.length) {
    return (
      <main className="app-shell narrow">
        <section className="panel empty-panel">
          <h1>No interview questions found</h1>
          <p className="muted">
            Generate an interview first so the session has questions to show.
          </p>
          <Link className="btn btn-primary" to="/interview-setup">
            Go to setup
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell narrow">
      <header className="page-header">
        <p className="eyebrow">Interview session</p>
        <h1>Question {currentQuestion + 1}</h1>
        <div className="progress-track" aria-label={`${progress}% complete`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="panel">
        <p className="question-text">{current}</p>
        <label>
          Your answer
          <textarea
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Answer with examples, tradeoffs, and outcomes..."
            rows="9"
            value={answer}
          />
        </label>
        <div className="button-row split">
          <button
            className="btn btn-secondary"
            disabled={currentQuestion === 0}
            onClick={previousQuestion}
          >
            Previous
          </button>
          <button className="btn btn-primary" onClick={nextQuestion}>
            {currentQuestion === questions.length - 1
              ? "Finish interview"
              : "Next question"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default InterviewSession;
