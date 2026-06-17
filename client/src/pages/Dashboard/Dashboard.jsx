import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChartLine, FaFileUpload, FaHistory, FaSignOutAlt } from "react-icons/fa";
import dashboardService from "../../services/dashboardService";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [summary, setSummary] = useState({
    completed: 0,
    averageScore: 0,
    recent: [],
  });

  useEffect(() => {
    dashboardService
      .getDashboardSummary()
      .then(setSummary)
      .catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="muted">{user?.email || "Plan your next practice round."}</p>
        </div>
        <button className="btn btn-ghost" onClick={logout}>
          <FaSignOutAlt aria-hidden="true" /> Logout
        </button>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Completed interviews</span>
          <strong>{summary.completed}</strong>
        </article>
        <article className="stat-card">
          <span>Average score</span>
          <strong>{summary.averageScore}%</strong>
        </article>
        <article className="stat-card">
          <span>Next step</span>
          <strong>Practice</strong>
        </article>
      </section>

      <section className="action-grid">
        <Link className="action-card" to="/resume-upload">
          <FaFileUpload aria-hidden="true" />
          <div>
            <h2>Upload resume</h2>
            <p>Use resume context for sharper interview questions.</p>
          </div>
        </Link>

        <Link className="action-card" to="/interview-setup">
          <FaChartLine aria-hidden="true" />
          <div>
            <h2>Start interview</h2>
            <p>Generate questions and begin a role-specific session.</p>
          </div>
        </Link>

        <Link className="action-card" to="/history">
          <FaHistory aria-hidden="true" />
          <div>
            <h2>View history</h2>
            <p>Review recent results and track progress over time.</p>
          </div>
        </Link>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent interviews</h2>
          <Link to="/history">View all</Link>
        </div>
        {summary.recent.length ? (
          <div className="list">
            {summary.recent.map((item) => (
              <div className="list-row" key={item._id}>
                <span>{item.role}</span>
                <strong>{item.score || 0}%</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No interviews yet. Start a mock interview to create your first
            scorecard.
          </p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
