import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../../components/UI/Toast";
import historyService from "../../services/historyService";

const History = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("active");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadHistory = () => {
    setLoading(true);
    historyService
      .getHistory({ search, difficulty, status, sort })
      .then((data) => setInterviews(data.interviews || []))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(loadHistory, 200);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, difficulty, status, sort]);

  const toggleSelected = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const deleteInterview = async (id) => {
    try {
      await historyService.deleteInterview(id);
      setInterviews((current) => current.filter((item) => item._id !== id));
      setLastDeleted({ ids: [id] });
      showSuccess("Interview deleted. Use undo to restore it.");
    } catch (error) {
      showError(error.response?.data?.message || "Unable to delete interview");
    }
  };

  const requestDelete = (ids) => {
    if (!ids.length) {
      showError("Select at least one interview");
      return;
    }

    setPendingDelete({ ids });
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.ids?.length) return;

    if (pendingDelete.ids.length === 1) {
      await deleteInterview(pendingDelete.ids[0]);
    } else {
      await bulkDelete();
    }

    setPendingDelete(null);
  };

  const bulkDelete = async () => {
    if (!selected.length) {
      showError("Select at least one interview");
      return;
    }

    try {
      await historyService.bulkDelete(selected);
      setInterviews((current) =>
        current.filter((item) => !selected.includes(item._id))
      );
      setLastDeleted({ ids: selected });
      setSelected([]);
      showSuccess("Selected interviews deleted. Use undo to restore them.");
    } catch (error) {
      showError(error.response?.data?.message || "Bulk delete failed");
    }
  };

  const restoreInterview = async (id) => {
    try {
      await historyService.restoreInterview(id);
      setInterviews((current) => current.filter((item) => item._id !== id));
      showSuccess("Interview restored");
    } catch (error) {
      showError(error.response?.data?.message || "Unable to restore interview");
    }
  };

  const openDetails = async (id) => {
    setDetailLoading(true);
    setActiveInterview(null);

    try {
      const data = await historyService.getInterview(id);
      setActiveInterview(data.interview);
    } catch (error) {
      showError(error.response?.data?.message || "Unable to load interview details");
    } finally {
      setDetailLoading(false);
    }
  };

  const undoDelete = async () => {
    if (!lastDeleted?.ids?.length) return;

    try {
      await Promise.all(
        lastDeleted.ids.map((id) => historyService.restoreInterview(id))
      );
      setLastDeleted(null);
      loadHistory();
      showSuccess("Deleted interviews restored");
    } catch (error) {
      showError(error.response?.data?.message || "Undo failed");
    }
  };

  const allSelected =
    interviews.length > 0 && interviews.every((item) => selected.includes(item._id));

  const toggleAll = () => {
    setSelected(allSelected ? [] : interviews.map((item) => item._id));
  };

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Progress</p>
        <h1>Interview history</h1>
        <p className="muted">Search, filter, delete, and restore interview records.</p>
      </header>

      <section className="panel">
        <div className="history-toolbar">
          <label>
            Search
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by role"
              value={search}
            />
          </label>
          <label>
            Difficulty
            <select
              onChange={(event) => setDifficulty(event.target.value)}
              value={difficulty}
            >
              <option value="">All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label>
            Status
            <select onChange={(event) => setStatus(event.target.value)} value={status}>
              <option value="active">Active</option>
              <option value="deleted">Deleted</option>
            </select>
          </label>
          <label>
            Sort
            <select onChange={(event) => setSort(event.target.value)} value={sort}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="score-high">Best score</option>
              <option value="score-low">Needs work</option>
            </select>
          </label>
        </div>

        <div className="button-row">
          {status === "active" ? (
            <button className="btn btn-secondary" onClick={() => requestDelete(selected)} type="button">
              Delete selected
            </button>
          ) : null}
          {lastDeleted ? (
            <button className="btn btn-primary" onClick={undoDelete} type="button">
              Undo delete
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className="empty-state">Loading interview history...</p>
        ) : interviews.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>ATS</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {status === "active" ? (
                  <tr>
                    <td colSpan="6">
                      <label className="checkbox-row">
                        <input checked={allSelected} onChange={toggleAll} type="checkbox" />
                        Select all visible interviews
                      </label>
                    </td>
                  </tr>
                ) : null}
                {interviews.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {status === "active" ? (
                        <input
                          aria-label={`Select ${item.role}`}
                          checked={selected.includes(item._id)}
                          onChange={() => toggleSelected(item._id)}
                          type="checkbox"
                        />
                      ) : null}
                      <span className="table-title">{item.role}</span>
                    </td>
                    <td>{item.difficulty || "N/A"}</td>
                    <td>{item.score || 0}%</td>
                    <td>{item.atsScore?.score ?? "N/A"}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-ghost compact"
                        onClick={() => openDetails(item._id)}
                        type="button"
                      >
                        Details
                      </button>
                      {status === "deleted" ? (
                        <button
                          className="btn btn-secondary compact"
                          onClick={() => restoreInterview(item._id)}
                          type="button"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary compact"
                          onClick={() => requestDelete([item._id])}
                          type="button"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-panel">
            <h2>No interviews saved yet</h2>
            <p className="muted">
              No matching interviews found. Adjust your filters or complete a new mock interview.
            </p>
            <Link className="btn btn-primary" to="/interview-setup">
              Start interview
            </Link>
          </div>
        )}
      </section>

      {detailLoading ? (
        <div className="modal-backdrop">
          <section className="modal-panel">
            <div className="loader" aria-hidden="true" />
            <p className="muted">Loading interview details...</p>
          </section>
        </div>
      ) : null}

      {activeInterview ? (
        <div className="modal-backdrop">
          <section className="modal-panel detail-modal">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Interview details</p>
                <h2>{activeInterview.role}</h2>
              </div>
              <button className="btn btn-ghost" onClick={() => setActiveInterview(null)} type="button">
                Close
              </button>
            </div>

            <div className="detail-summary">
              <span>Score <strong>{activeInterview.score || 0}%</strong></span>
              <span>Difficulty <strong>{activeInterview.difficulty || "N/A"}</strong></span>
              <span>Date <strong>{new Date(activeInterview.createdAt).toLocaleDateString()}</strong></span>
            </div>

            <div className="career-grid">
              <div>
                <h3>Strengths</h3>
                <p>{activeInterview.feedback?.strengths?.join(", ") || "Keep building answer structure and specificity."}</p>
              </div>
              <div>
                <h3>Weaknesses</h3>
                <p>{activeInterview.feedback?.weaknesses?.join(", ") || "Add more role-specific depth."}</p>
              </div>
              <div>
                <h3>Improve next</h3>
                <p>{activeInterview.feedback?.suggestions?.join(" ") || activeInterview.feedback?.feedback}</p>
              </div>
            </div>

            <div className="qa-list">
              {(activeInterview.feedback?.questionScores || activeInterview.questions || []).map((item, index) => {
                const question = item.question || activeInterview.questions?.[index];
                const answer = item.answer || activeInterview.answers?.[index];
                return (
                  <article className="qa-card" key={`${question}-${index}`}>
                    <div className="section-heading">
                      <h3>Question {index + 1}</h3>
                      <strong>{item.score ?? "N/A"}%</strong>
                    </div>
                    <p className="question-text">{question}</p>
                    <p className="muted"><strong>Your answer:</strong> {answer || "No answer recorded."}</p>
                    <p className="muted"><strong>Feedback:</strong> {item.feedback || "Review this answer for clarity and relevance."}</p>
                    {item.correctAnswer ? (
                      <p className="muted"><strong>Expected answer:</strong> {item.correctAnswer}</p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}

      {pendingDelete ? (
        <div className="modal-backdrop">
          <section className="modal-panel">
            <p className="eyebrow">Confirm delete</p>
            <h2>Move {pendingDelete.ids.length} interview{pendingDelete.ids.length > 1 ? "s" : ""} to recycle bin?</h2>
            <p className="muted">You can restore deleted interviews from the deleted status filter.</p>
            <div className="button-row">
              <button className="btn btn-secondary" onClick={() => setPendingDelete(null)} type="button">
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmDelete} type="button">
                Confirm delete
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
};

export default History;
