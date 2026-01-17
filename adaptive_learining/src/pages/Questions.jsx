import { useEffect, useMemo, useState } from "react";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../services/questions";
import { getLessons } from "../services/lessons";

const PAGE_SIZE = 10;

export default function Questions() {
  const [items, setItems] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    text: "",
    difficulty: "easy",
    lesson_id: "",
    correct_answer: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // FETCH
  useEffect(() => {
    fetchQuestions();
    fetchLessons();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getQuestions();
      setItems(res.data);
      setCurrentPage(1); // refresh sonrası başa dön
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

  // FILTER
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => !s || x.text.toLowerCase().includes(s));
  }, [items, q]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

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
      setForm({
        text: "",
        difficulty: "easy",
        lesson_id: lessons[0]?.id || "",
        correct_answer: "",
      });
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

      {/* SEARCH */}
      <input
        placeholder="Search question..."
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setCurrentPage(1);
        }}
        style={{ width: "100%", padding: 10, margin: "12px 0" }}
      />

      {/* FORM */}
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <select
          value={form.lesson_id}
          onChange={(e) =>
            setForm({ ...form, lesson_id: Number(e.target.value) })
          }
          style={{ padding: 10 }}
        >
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.title}
            </option>
          ))}
        </select>

        <input
          placeholder="Question text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          style={{ flex: 1, minWidth: 260, padding: 10 }}
        />

        <input
          placeholder="Correct answer"
          value={form.correct_answer}
          onChange={(e) =>
            setForm({ ...form, correct_answer: e.target.value })
          }
          style={{ flex: 1, minWidth: 260, padding: 10 }}
        />

        <select
          value={form.difficulty}
          onChange={(e) =>
            setForm({ ...form, difficulty: e.target.value })
          }
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
              setForm({
                text: "",
                difficulty: "easy",
                lesson_id: lessons[0]?.id || "",
                correct_answer: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading && <p>Loading questions...</p>}

      {/* LIST */}
      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {paginatedItems.map((x) => (
          <div
            key={x.id}
            style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}
          >
            <div style={{ fontWeight: 600 }}>{x.text}</div>
            <div>Difficulty: {x.difficulty}</div>
            <div>
              Lesson:{" "}
              {lessons.find((l) => l.id === x.lesson_id)?.title || "Unknown"}
            </div>
            <div>Correct Answer: {x.correct_answer}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={() => edit(x)}>Edit</button>
              <button onClick={() => remove(x.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && paginatedItems.length === 0 && <p>No questions found.</p>}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ◀ Prev
          </button>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
