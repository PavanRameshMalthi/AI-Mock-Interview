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
  const [selected, setSelected] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null);

  const loadHistory = () => {
    setLoading(true);
    historyService
      .getHistory({ search, difficulty, status })
      .then((data) => setInterviews(data.interviews || []))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(loadHistory, 200);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, difficulty, status]);

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
        </div>

        <div className="button-row">
          {status === "active" ? (
            <button className="btn btn-secondary" onClick={bulkDelete} type="button">
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
                  <th>Action</th>
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
                      {status === "deleted" ? (
                        <button
                          className="btn btn-secondary"
                          onClick={() => restoreInterview(item._id)}
                          type="button"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          onClick={() => deleteInterview(item._id)}
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
    </main>
  );
};

export default History;
