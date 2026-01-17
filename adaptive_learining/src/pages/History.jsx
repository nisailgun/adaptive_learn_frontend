import { useEffect, useState } from "react";
import { 
  getAllHistory, 
  getHistoryByEmail, 
  createHistory, 
  updateHistory, 
  deleteHistory 
} from "../services/history"; // history service'i backend endpointlerine göre ayarlayın

export default function HistoryCRUD() {
  const [histories, setHistories] = useState([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ student_id: "", question_id: "", time_taken_seconds: 0, correct: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // -------------------
  // Fetch all histories
  // -------------------
  const fetchHistories = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (emailFilter.trim()) {
        res = await getHistoryByEmail(emailFilter);
      } else {
        res = await getAllHistory();
      }
      setHistories(res.data);
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
      setForm({ student_id: "", question_id: "", time_taken_seconds: 0, correct: "" });
      setEditingId(null);
      fetchHistories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error saving history");
    }
  };

  // -------------------
  // EDIT
  // -------------------
const edit = (h) => {
  setEditingId(h.id);
  setForm({
    student_id: h.student_id,
    question_id: h.question_id,
    time_taken_seconds: h.time_taken_seconds,
    correct: h.correct || 0, // float default
  });
};


  // -------------------
  // DELETE
  // -------------------
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

      {/* Email filtreleme */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="email"
          placeholder="Filter by student email..."
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          style={{ width: "70%", padding: 10, marginRight: 10 }}
        />
        <button onClick={fetchHistories} style={{ padding: "10px 20px" }}>
          Search
        </button>
      </div>

      {/* Create / Update form */}
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="number"
          placeholder="Student ID"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: Number(e.target.value) })}
          style={{ flex: 1, minWidth: 150, padding: 10 }}
        />
        <input
          type="number"
          placeholder="Question ID"
          value={form.question_id}
          onChange={(e) => setForm({ ...form, question_id: Number(e.target.value) })}
          style={{ flex: 1, minWidth: 150, padding: 10 }}
        />
        <input
          type="number"
          placeholder="Time Taken (seconds)"
          value={form.time_taken_seconds}
          onChange={(e) => setForm({ ...form, time_taken_seconds: Number(e.target.value) })}
          style={{ flex: 1, minWidth: 150, padding: 10 }}
        />
        <input
          type="number"
          placeholder="Correct Answer"
          value={form.correct}
          onChange={(e) => setForm({ ...form, correct: Number(e.target.value) })}
          style={{ flex: 1, minWidth: 150, padding: 10 }}
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ student_id: "", question_id: "", time_taken_seconds: 0, correct: 0 });
            }}
          >
            Cancel
          </button>
        )}
      </form>


      {loading && <p>Loading histories...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* History listesi */}
      <div style={{ display: "grid", gap: 10 }}>
        {histories.map((h) => (
          <div key={h.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>
              Student ID: {h.student_id} • Question ID: {h.question_id} • Correct: {h.correct || "-"}
            </div>
            <div style={{ opacity: 0.8 }}>
              Time Taken: {h.time_taken_seconds}s • Answered At: {new Date(h.answered_at).toLocaleString()}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => edit(h)}>Edit</button>
              <button onClick={() => remove(h.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && histories.length === 0 && <p>No histories found.</p>}
      </div>
    </div>
  );
}
