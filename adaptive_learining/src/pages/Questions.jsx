import { useEffect, useMemo, useState } from "react";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from "../services/questions";
import { getLessons } from "../services/lessons";

export default function Questions() {
  const [items, setItems] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ text: "", difficulty: "easy", lesson_id: "", correct_answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET ALL QUESTIONS ve LESSONS
  useEffect(() => {
    fetchQuestions();
    fetchLessons();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getQuestions();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await getLessons();
      setLessons(res.data);
      if (res.data.length > 0 && !form.lesson_id) {
        setForm((prev) => ({ ...prev, lesson_id: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => !s || x.text.toLowerCase().includes(s));
  }, [items, q]);

  // CREATE / UPDATE
  const submit = async (e) => {
    e.preventDefault();
    if (!form.text.trim() || !form.lesson_id) return;

    try {
      if (editingId) {
        await updateQuestion(editingId, form);
      } else {
        await createQuestion(form);
      }
      setForm({ text: "", difficulty: "easy", lesson_id: lessons[0]?.id || "", correct_answer: "" });
      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      text: item.text,
      difficulty: item.difficulty,
      lesson_id: item.lesson_id,
      correct_answer: item.correct_answer || "",
    });
  };

  const remove = async (id) => {
    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

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
        {/* Lessons dropdown */}
        <select
          value={form.lesson_id}
          onChange={(e) => setForm({ ...form, lesson_id: Number(e.target.value) })}
          style={{ padding: 10 }}
        >
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.title}
            </option>
          ))}
        </select>

        {/* Question text */}
        <input
          placeholder="Question text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          style={{ flex: 1, minWidth: 260, padding: 10 }}
        />

        {/* Correct answer */}
        <input
          placeholder="Correct answer"
          value={form.correct_answer}
          onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
          style={{ flex: 1, minWidth: 260, padding: 10 }}
        />

        {/* Difficulty */}
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
            onClick={() =>
              setForm({ text: "", difficulty: "easy", lesson_id: lessons[0]?.id || "", correct_answer: "" }) ||
              setEditingId(null)
            }
          >
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading questions...</p>}

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {filtered.map((x) => (
          <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{x.text}</div>
            <div style={{ opacity: 0.8 }}>Difficulty: {x.difficulty}</div>
            <div style={{ opacity: 0.8 }}>
              Lesson: {lessons.find((l) => l.id === x.lesson_id)?.title || "Unknown"}
            </div>
            <div style={{ opacity: 0.8 }}>Correct Answer: {x.correct_answer}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => edit(x)}>Edit</button>
              <button onClick={() => remove(x.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <p>No questions found.</p>}
      </div>
    </div>
  );
}
