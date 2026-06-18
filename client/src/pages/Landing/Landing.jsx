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
    ["10,000+", "Interviews conducted"],
    ["95%", "Success rate"],
    ["5000+", "Students assisted"],
    ["4.9", "Average rating"],
  ];

  const features = [
    [FaMicrophone, "AI Mock Interviews", "Practice role-specific questions with voice and text answers."],
    [FaFileAlt, "Resume ATS Analysis", "Score resumes, detect skills, and surface missing role keywords."],
    [FaCheckCircle, "AI Feedback", "See what was correct, what was missing, and how to improve."],
    [FaChartLine, "Analytics Dashboard", "Track scores, weak areas, streaks, and skill growth."],
    [FaChartLine, "Progress Tracking", "Compare weekly, monthly, role-based, and skill-based growth."],
    [FaFileAlt, "PDF Reports", "Export polished reports with scores, feedback, and recommendations."],
    [FaCertificate, "Certificates", "Download a completion certificate for portfolio-ready proof."],
    [FaShieldAlt, "Interview History", "Search, filter, restore, and review every saved interview."],
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
      <nav className="landing-nav" aria-label="Landing navigation">
        <Link className="brand-mark" to="/">AI Interview</Link>
        <div>
          <Link to="/login">Sign in</Link>
          <Link className="btn btn-primary compact" to="/register">Start free</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">AI Mock Interview</p>
          <h1>Master Every Interview With AI</h1>
          <p className="hero-text">
            Practice real interviews, receive AI-powered feedback, improve
            skills, and track your progress with a recruiter-ready preparation
            workspace.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/interview-setup">
              Start Interview <FaArrowRight aria-hidden="true" />
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Watch Demo
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
            "This felt like a real placement-prep product: resume scoring,
            voice practice, analytics, and reports in one polished flow."
          </p>
          <strong>Final-year project evaluator</strong>
        </article>
        <article className="testimonial-card">
          <p>
            "The feedback cards made it clear exactly what I had to improve
            before my next technical round."
          </p>
          <strong>Frontend internship candidate</strong>
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
        <div>
          <p className="eyebrow">Ready To Land Your Dream Job?</p>
          <h2>Start Practicing Today</h2>
        </div>
        <Link className="btn btn-primary" to="/register">
          Create free account <FaArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
};

export default Landing;
