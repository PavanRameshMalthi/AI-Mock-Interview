import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

const Landing = () => {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">AI Mock Interview</p>
          <h1>Practice interviews with focused AI feedback.</h1>
          <p className="hero-text">
            Upload a resume, generate role-specific questions, answer at your
            pace, and review a scorecard that highlights what to improve next.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">
              Start practicing <FaArrowRight aria-hidden="true" />
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Sign in
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Interview readiness summary">
          <div className="score-ring">86</div>
          <div>
            <h2>Readiness snapshot</h2>
            <ul className="feature-list">
              <li>
                <FaCheckCircle aria-hidden="true" /> Technical depth tracked
              </li>
              <li>
                <FaCheckCircle aria-hidden="true" /> Communication feedback
              </li>
              <li>
                <FaCheckCircle aria-hidden="true" /> Resume-aware prompts
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
