import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dashboardService from "../../services/dashboardService";

const Profile = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
  );
  const [summary, setSummary] = useState({
    completed: 0,
    averageScore: 0,
    recent: [],
  });
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardService.getDashboardSummary().catch(() => summary),
      dashboardService.getAnalytics().catch(() => null),
    ]).then(([summaryData, analyticsData]) => {
      setSummary(summaryData);
      setAnalytics(analyticsData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = (user?.name || user?.email || "AI")
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className="app-shell">
      <section className="profile-hero">
        <div className="avatar-mark" aria-hidden="true">{initials}</div>
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{user?.name || "Interview Candidate"}</h1>
          <p className="muted">{user?.email || "Track your readiness profile and achievements."}</p>
        </div>
        <Link className="btn btn-primary" to="/interview-setup">Start Interview</Link>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Interviews completed</span>
          <strong>{summary.completed}</strong>
        </article>
        <article className="stat-card">
          <span>Average score</span>
          <strong>{summary.averageScore}%</strong>
        </article>
        <article className="stat-card">
          <span>Best score</span>
          <strong>{analytics?.summary?.bestScore || 0}%</strong>
        </article>
        <article className="stat-card">
          <span>Certificates earned</span>
          <strong>{summary.completed ? 1 : 0}</strong>
        </article>
      </section>

      <section className="analytics-grid">
        <article className="panel">
          <div className="section-heading">
            <h2>Interview history summary</h2>
            <Link to="/history">View history</Link>
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
            <p className="empty-state">No interviews completed yet.</p>
          )}
        </article>
        <article className="panel">
          <h2>Readiness profile</h2>
          <div className="tag-list">
            {(analytics?.strongSkillAreas?.length
              ? analytics.strongSkillAreas.map((item) => item.name)
              : ["Communication", "Problem Solving", "Role Fit"]
            ).map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
      </section>
    </main>
  );
};

export default Profile;
