import { useMemo, useState } from "react";

const INITIAL = [
  { id: 1, text: "What is OOP?", difficulty: "Easy" },
  { id: 2, text: "Explain SOLID.", difficulty: "Medium" },
];

export default function Questions() {
  const [items, setItems] = useState(INITIAL);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ text: "", difficulty: "Easy" });
  const [editingId, setEditingId] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => !s || x.text.toLowerCase().includes(s));
  }, [items, q]);

  function submit(e) {
    e.preventDefault();
    if (!form.text.trim()) return;

    if (editingId) {
      setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...form } : x)));
      setEditingId(null);
    } else {
      setItems((prev) => [{ id: Date.now(), ...form }, ...prev]);
    }

    setForm({ text: "", difficulty: "Easy" });
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ text: item.text, difficulty: item.difficulty });
  }

  function remove(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Questions</h2>

      <input
        placeholder="Search question..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "12px 0" }}
      />

      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Question text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          style={{ flex: 1, minWidth: 260, padding: 10 }}
        />
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          style={{ padding: 10 }}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ text: "", difficulty: "Easy" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {filtered.map((x) => (
          <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{x.text}</div>
            <div style={{ opacity: 0.8 }}>Difficulty: {x.difficulty}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => edit(x)}>Edit</button>
              <button onClick={() => remove(x.id)}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p>No questions found.</p>}
      </div>
    </div>
  );
}
