import { useMemo, useState } from "react";

const INITIAL = [
  { id: 1, title: "Intro to Java", level: "Beginner" },
  { id: 2, title: "React Basics", level: "Beginner" },
];

export default function Lessons() {
  const [items, setItems] = useState(INITIAL);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ title: "", level: "Beginner" });
  const [editingId, setEditingId] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => !s || x.title.toLowerCase().includes(s));
  }, [items, q]);

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...form } : x)));
      setEditingId(null);
    } else {
      setItems((prev) => [{ id: Date.now(), ...form }, ...prev]);
    }

    setForm({ title: "", level: "Beginner" });
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ title: item.title, level: item.level });
  }

  function remove(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Lessons</h2>

      <input
        placeholder="Search lesson..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "12px 0" }}
      />

      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Lesson title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ flex: 1, minWidth: 220, padding: 10 }}
        />
        <select
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          style={{ padding: 10 }}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", level: "Beginner" }); }}>Cancel</button>}
      </form>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {filtered.map((x) => (
          <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{x.title}</div>
            <div style={{ opacity: 0.8 }}>Level: {x.level}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => edit(x)}>Edit</button>
              <button onClick={() => remove(x.id)}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p>No lessons found.</p>}
      </div>
    </div>
  );
}
