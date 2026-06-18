import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChartLine, FaFileUpload, FaHistory, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";
import dashboardService from "../../services/dashboardService";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
  );
  const [summary, setSummary] = useState({
    completed: 0,
    averageScore: 0,
    recent: [],
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getDashboardSummary(),
      dashboardService.getAnalytics().catch(() => null),
    ])
      .then(([summaryData, analyticsData]) => {
        setSummary(summaryData);
        setAnalytics(analyticsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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
        <Link className="btn btn-secondary" to="/profile">
          Profile
        </Link>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Completed interviews</span>
          <strong>{loading ? "..." : summary.completed}</strong>
        </article>
        <article className="stat-card">
          <span>Average score</span>
          <strong>{loading ? "..." : `${summary.averageScore}%`}</strong>
        </article>
        <article className="stat-card">
          <span>Best score</span>
          <strong>{analytics?.summary ? `${analytics.summary.bestScore}%` : "..."}</strong>
        </article>
        <article className="stat-card">
          <span>Improvement</span>
          <strong>{analytics?.summary ? `${analytics.summary.improvementPercentage}%` : "Practice"}</strong>
        </article>
        <article className="stat-card">
          <span>Interview streak</span>
          <strong>{analytics?.summary ? `${analytics.summary.interviewStreak}d` : "0d"}</strong>
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

        {user?.role === "admin" ? (
          <Link className="action-card" to="/admin">
            <FaShieldAlt aria-hidden="true" />
            <div>
              <h2>Admin panel</h2>
              <p>Monitor users, interviews, ATS reports, and exports.</p>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Recent interviews</h2>
          <Link to="/history">View all</Link>
        </div>
        {summary.recent.length ? (
          <div className="list">
            {summary.recent.map((item) => (
              <Link className="list-row interactive-row" key={item._id} to="/history">
                <span>{item.role}</span>
                <strong>{item.score || 0}%</strong>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No interviews yet. Start a mock interview to create your first
            scorecard.
          </p>
        )}
      </section>

      <section className="analytics-grid">
        <article className="panel">
          <h2>Monthly progress</h2>
          {analytics?.trends?.monthlyProgress?.length ? (
            <div className="mini-chart progress-chart">
              {analytics.trends.monthlyProgress.slice(-6).map((item) => (
                <span
                  aria-label={`${item.month} ${item.averageScore}%`}
                  key={item.month}
                  style={{ height: `${Math.max(item.averageScore, 6)}%` }}
                  title={`${item.month}: ${item.averageScore}%`}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>Skill growth</h2>
          {analytics?.skillGrowth?.length ? (
            <div className="skill-growth">
              {analytics.skillGrowth.map((item) => (
                <div className="score-row" key={item.skill}>
                  <span>{item.skill}</span>
                  <div className="meter">
                    <span style={{ width: `${Math.max(item.score, 4)}%` }} />
                  </div>
                  <strong>{item.score}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>Weekly progress</h2>
          {analytics?.trends?.weeklyProgress?.length ? (
            <div className="mini-chart progress-chart">
              {analytics.trends.weeklyProgress.slice(-8).map((item) => (
                <span
                  aria-label={`${item.week} ${item.averageScore}%`}
                  key={item.week}
                  style={{ height: `${Math.max(item.averageScore, 6)}%` }}
                  title={`${item.week}: ${item.averageScore}%`}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>Role-based progress</h2>
          {analytics?.trends?.roleBasedProgress?.length ? (
            <div className="skill-growth">
              {analytics.trends.roleBasedProgress.slice(0, 6).map((item) => (
                <div className="score-row" key={item.role}>
                  <span>{item.role}</span>
                  <div className="meter">
                    <span style={{ width: `${Math.max(item.averageScore, 4)}%` }} />
                  </div>
                  <strong>{item.averageScore}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>Interview score trend</h2>
          {analytics?.trends?.interviewScores?.length ? (
            <div className="mini-chart">
              {analytics.trends.interviewScores.slice(-8).map((item, index) => (
                <span
                  aria-label={`${item.role} ${item.score}%`}
                  key={`${item.date}-${index}`}
                  style={{ height: `${Math.max(item.score, 6)}%` }}
                  title={`${item.role}: ${item.score}%`}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>ATS score trend</h2>
          {analytics?.trends?.atsScores?.length ? (
            <div className="mini-chart ats-chart">
              {analytics.trends.atsScores.slice(-8).map((item, index) => (
                <span
                  aria-label={`${item.role || "Resume"} ${item.score}%`}
                  key={`${item.date}-${index}`}
                  style={{ height: `${Math.max(item.score, 6)}%` }}
                  title={`${item.role || "Resume"}: ${item.score}%`}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>Strong skill areas</h2>
          {analytics?.strongSkillAreas?.length ? (
            <div className="tag-list">
              {analytics.strongSkillAreas.map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>

        <article className="panel">
          <h2>Weak skill areas</h2>
          {analytics?.weakSkillAreas?.length ? (
            <div className="tag-list warning">
              {analytics.weakSkillAreas.map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
