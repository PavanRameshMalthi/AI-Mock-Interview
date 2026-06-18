import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Results = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const evaluateInterview = useCallback(async () => {
    try {
      const questions = JSON.parse(localStorage.getItem("questions") || "[]");
      const answers = JSON.parse(localStorage.getItem("answers") || "[]");
      const config = JSON.parse(
        localStorage.getItem("interviewConfig") || "{}"
      );
      const resumeText = localStorage.getItem("resumeText") || "";

      if (!questions.length || !answers.length || !config.role) {
        setError("Complete an interview before viewing results.");
        return;
      }

      const response = await api.post("/evaluation/evaluate", {
        role: config.role,
        difficulty: config.difficulty,
        questions,
        answers,
        resumeText,
      });

      setResult(response.data);
      if (response.data.atsScore) {
        localStorage.setItem("atsScore", JSON.stringify(response.data.atsScore));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to evaluate interview");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      evaluateInterview();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [evaluateInterview]);

  const downloadPDF = async () => {
    if (!result) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const config = JSON.parse(localStorage.getItem("interviewConfig") || "{}");
    const lines = [
      "AI Mock Interview Report",
      `Candidate: ${user?.name || "Candidate"}`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Interview Role: ${config.role || "N/A"}`,
      `Difficulty: ${config.difficulty || "N/A"}`,
      `Interview Score: ${result.overall}/100`,
      `Technical: ${result.technical}/100`,
      `Communication: ${result.communication}/100`,
      `Problem Solving: ${result.problemSolving}/100`,
    ];

    doc.setFontSize(18);
    doc.text(lines[0], 20, 20);
    doc.setFontSize(12);
    lines.slice(1).forEach((line, index) => doc.text(line, 20, 38 + index * 10));
    let y = 128;
    if (result.atsScore) {
      doc.text(`ATS Score: ${result.atsScore.score}/100 (${result.atsScore.level})`, 20, y);
      y += 12;
      doc.text(`Weak Areas: ${(result.atsScore.weaknesses || result.atsScore.missingKeywords || []).slice(0, 4).join(", ") || "N/A"}`, 20, y, { maxWidth: 170 });
      y += 18;
      doc.text(`Strong Areas: ${(result.atsScore.strengths || result.atsScore.matchedKeywords || []).slice(0, 4).join(", ") || "N/A"}`, 20, y, { maxWidth: 170 });
      y += 18;
    }
    doc.text("AI Feedback:", 20, y);
    y += 10;
    doc.text(result.feedback || "No feedback provided.", 20, y, { maxWidth: 170 });
    y += 34;
    doc.text("Suggestions:", 20, y);
    y += 10;
    doc.text(
      (result.atsScore?.recommendations || [
        "Practice concise STAR stories with measurable outcomes.",
        "Add stronger role-specific project examples.",
      ]).join(" "),
      20,
      y,
      { maxWidth: 170 }
    );
    doc.save("Interview_Report.pdf");
  };

  if (loading) {
    return (
      <main className="app-shell narrow">
        <section className="panel empty-panel">
          <div className="loader" aria-hidden="true" />
          <h1>Evaluating your interview</h1>
          <p className="muted">This usually takes a few seconds.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell narrow">
        <section className="panel empty-panel">
          <h1>Results unavailable</h1>
          <p className="muted">{error}</p>
          <Link className="btn btn-primary" to="/interview-setup">
            Start a new interview
          </Link>
        </section>
      </main>
    );
  }

  const scores = [
    ["Technical", result.technical],
    ["Communication", result.communication],
    ["Problem solving", result.problemSolving],
  ];
  const atsScore = result.atsScore;

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Scorecard</p>
        <h1>Interview results</h1>
        <p className="muted">
          Use this feedback to tune your examples before the next practice run.
        </p>
      </header>

      <section className="results-grid">
        <article className="result-score">
          <span>Overall</span>
          <strong>{result.overall}</strong>
          <small>/100</small>
        </article>

        <article className="panel">
          <h2>Skill breakdown</h2>
          <div className="score-list">
            {scores.map(([label, score]) => (
              <div className="score-row" key={label}>
                <span>{label}</span>
                <div className="meter">
                  <span style={{ width: `${score}%` }} />
                </div>
                <strong>{score}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <h2>Feedback</h2>
        <p className="feedback-text">{result.feedback}</p>
        <div className="career-grid">
          <div>
            <h3>Recommended skills</h3>
            <p>{atsScore?.missingKeywords?.slice(0, 5).join(", ") || "Role-specific examples, communication, and tradeoff analysis."}</p>
          </div>
          <div>
            <h3>Suggested projects</h3>
            <p>Build one deployable project that demonstrates the target role, measurable impact, and testing discipline.</p>
          </div>
          <div>
            <h3>Career roadmap</h3>
            <p>Improve weak keywords, practice two more interviews, then update your resume with quantified outcomes.</p>
          </div>
        </div>
        <div className="button-row">
          <button className="btn btn-primary" onClick={downloadPDF}>
            Download PDF
          </button>
          <Link className="btn btn-secondary" to="/interview-setup">
            Practice again
          </Link>
        </div>
      </section>

      {atsScore ? (
        <section className="panel ats-panel">
          <div className="section-heading">
            <div>
              <h2>ATS resume fit</h2>
              <p className="muted">How closely your resume matches this target role.</p>
            </div>
            <strong>{atsScore.score}%</strong>
          </div>
          <div className="score-row ats-row">
            <span>{atsScore.level}</span>
            <div className="meter">
              <span style={{ width: `${atsScore.score}%` }} />
            </div>
            <strong>{atsScore.score}</strong>
          </div>
          <div className="keyword-grid">
            <div>
              <h3>Matched keywords</h3>
              <p>{atsScore.matchedKeywords?.join(", ") || "No strong matches yet."}</p>
            </div>
            <div>
              <h3>Missing keywords</h3>
              <p>{atsScore.missingKeywords?.join(", ") || "No critical gaps detected."}</p>
            </div>
          </div>
          <ul className="recommendation-list">
            {(atsScore.recommendations || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
};

export default Results;
