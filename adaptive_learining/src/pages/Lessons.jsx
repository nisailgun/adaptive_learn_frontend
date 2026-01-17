import { useEffect, useMemo, useState } from "react";
import { getLessons, createLesson, updateLesson, deleteLesson } from "../services/lessons";

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ title: "", difficulty: "easy" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");
  const isStudent = role === "student";

  // GET ALL LESSONS
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await getLessons();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => !s || x.title.toLowerCase().includes(s));
  }, [items, q]);

  // CREATE / UPDATE
  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      if (editingId) {
        await updateLesson(editingId, form);
      } else {
        await createLesson(form);
      }
      setForm({ title: "", difficulty: "easy" });
      setEditingId(null);
      fetchLessons();
    } catch (err) {
      console.error(err);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, difficulty: item.difficulty });
  };

  const remove = async (id) => {
    try {
      await deleteLesson(id);
      fetchLessons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Lessons</h2>

      <input
        placeholder="Search lesson..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "12px 0" }}
      />

      {/* CREATE / UPDATE FORM → SADECE STUDENT DEĞİLSE */}
      {!isStudent && (
        <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="Lesson title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ flex: 1, minWidth: 220, padding: 10 }}
          />
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            style={{ padding: 10 }}
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>
          <button type="submit">{editingId ? "Update" : "Create"}</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", difficulty: "easy" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {loading && <p>Loading lessons...</p>}

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {filtered.map((x) => (
          <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{x.title}</div>
            <div style={{ opacity: 0.8 }}>Difficulty: {x.difficulty}</div>

            {/* EDIT / DELETE → SADECE STUDENT DEĞİLSE */}
            {!isStudent && (
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={() => edit(x)}>Edit</button>
                <button onClick={() => remove(x.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {!loading && filtered.length === 0 && <p>No lessons found.</p>}
      </div>
    </div>
  );
}
