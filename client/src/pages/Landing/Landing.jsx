import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCertificate,
  FaChartLine,
  FaCheckCircle,
  FaFileAlt,
  FaMicrophone,
  FaShieldAlt,
} from "react-icons/fa";

const Landing = () => {
  const stats = [
    ["95+", "Readiness signals"],
    ["5 MB", "Secure PDF parsing"],
    ["24/7", "Practice availability"],
    ["PDF", "Reports and certificate"],
  ];

  const features = [
    [FaFileAlt, "ATS Resume Analyzer", "Score resumes, detect skills, and surface missing role keywords."],
    [FaMicrophone, "Voice Interview", "Listen to questions and answer with microphone or text fallback."],
    [FaChartLine, "Analytics Dashboard", "Track interview scores, ATS trends, strengths, and weak areas."],
    [FaCertificate, "Certificates", "Download a completion certificate for portfolio-ready proof."],
    [FaShieldAlt, "Secure Sessions", "JWT auth, refresh cookies, rate limits, validation, and hardened uploads."],
  ];

  const steps = [
    "Upload resume",
    "Pick target role",
    "Practice interview",
    "Review analytics",
    "Download report",
  ];

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">AI Mock Interview</p>
          <h1>Enterprise-grade interview practice for job-ready candidates.</h1>
          <p className="hero-text">
            Upload a resume, practice with AI-generated role questions, analyze
            ATS fit, track progress, and export polished reports for your final
            year project or portfolio demo.
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

      <section className="stats-grid landing-stats" aria-label="Platform statistics">
        {stats.map(([value, label]) => (
          <article className="stat-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="landing-band">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Features</p>
            <h2>Everything for a complete mock interview workflow</h2>
          </div>
        </div>
        <div className="feature-grid">
          {features.map(([Icon, title, description]) => (
            <article className="feature-card" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-band">
        <p className="eyebrow">Workflow</p>
        <h2>From resume to report in one guided flow</h2>
        <ol className="timeline">
          {steps.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-grid">
        <article className="testimonial-card">
          <p>
            "The platform feels like a complete placement-prep product: resume
            scoring, voice practice, analytics, and reports in one place."
          </p>
          <strong>Final-year project evaluator</strong>
        </article>
        <article className="faq-card">
          <h2>FAQ</h2>
          <details open>
            <summary>Can I practice without a resume?</summary>
            <p>Yes. Resume context improves personalization, but general role interviews still work.</p>
          </details>
          <details>
            <summary>Does it work if Gemini is unavailable?</summary>
            <p>Yes. Local fallback questions and evaluation keep the app usable for demos.</p>
          </details>
        </article>
      </section>

      <section className="cta-band">
        <h2>Ready to run a complete mock interview?</h2>
        <Link className="btn btn-primary" to="/register">
          Create free account <FaArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
};

export default Landing;
