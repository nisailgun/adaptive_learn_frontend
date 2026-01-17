import { useEffect, useMemo, useState } from "react";
import { 
  getAllHistory, 
  getHistoryByEmail, 
  createHistory, 
  updateHistory, 
  deleteHistory 
} from "../services/history";

const PAGE_SIZE = 10;

export default function HistoryCRUD() {
  const [histories, setHistories] = useState([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student_id: "",
    question_id: "",
    time_taken_seconds: 0,
    correct: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // -------------------
  // Fetch histories
  // -------------------
  const fetchHistories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = emailFilter.trim()
        ? await getHistoryByEmail(emailFilter)
        : await getAllHistory();

      setHistories(res.data);
      setCurrentPage(1); // filtre değişince sayfa reset
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error fetching histories");
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  // -------------------
  // Pagination
  // -------------------
  const totalPages = Math.ceil(histories.length / PAGE_SIZE);

  const paginatedHistories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return histories.slice(start, start + PAGE_SIZE);
  }, [histories, currentPage]);

  // -------------------
  // CREATE / UPDATE
  // -------------------
  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_id || !form.question_id) return;

    try {
      if (editingId) {
        await updateHistory(editingId, form);
      } else {
        await createHistory(form);
      }
      setForm({ student_id: "", question_id: "", time_taken_seconds: 0, correct: 0 });
      setEditingId(null);
      fetchHistories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error saving history");
    }
  };

  const edit = (h) => {
    setEditingId(h.id);
    setForm({
      student_id: h.student_id,
      question_id: h.question_id,
      time_taken_seconds: h.time_taken_seconds,
      correct: h.correct || 0,
    });
  };

  const remove = async (id) => {
    try {
      await deleteHistory(id);
      fetchHistories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error deleting history");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>History</h2>

      {/* Email Filter */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="email"
          placeholder="Filter by student email..."
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          style={{ width: "70%", padding: 10, marginRight: 10 }}
        />
        <button onClick={fetchHistories}>Search</button>
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="number"
          placeholder="Student ID"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Question ID"
          value={form.question_id}
          onChange={(e) => setForm({ ...form, question_id: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Time Taken (seconds)"
          value={form.time_taken_seconds}
          onChange={(e) => setForm({ ...form, time_taken_seconds: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Correct (0/1)"
          value={form.correct}
          onChange={(e) => setForm({ ...form, correct: Number(e.target.value) })}
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* History List */}
      <div style={{ display: "grid", gap: 10 }}>
        {paginatedHistories.map((h) => (
          <div key={h.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>
              Student: {h.student_id} • Question: {h.question_id} • Correct: {h.correct}
            </div>
            <div style={{ opacity: 0.8 }}>
              Time: {h.time_taken_seconds}s • {new Date(h.answered_at).toLocaleString()}
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => edit(h)}>Edit</button>
              <button onClick={() => remove(h.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            Previous
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
