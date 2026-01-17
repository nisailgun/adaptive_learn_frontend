import { useEffect, useState } from "react";
import { getLessons } from "../services/lessons";
import { getQuestionByLesson } from "../services/questions";

export default function LessonQuestionGenerator() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await getLessons();
      setLessons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Soru gelince sayaç başlasın
  useEffect(() => {
    if (!question) return;

    setSeconds(0);

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  const selectLesson = async (lesson) => {
    setSelectedLesson(lesson);
    setQuestion(null);
    setAnswer("");
    setError("");
    setLoading(true);

    try {
      const res = await getQuestionByLesson(lesson.id);
      setQuestion(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Soru alınamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    console.log({
      question_id: question.id,
      answer,
      time_taken_seconds: seconds,
    });

    alert(`Cevap kaydedildi (${seconds} saniye)`);

    // İleride:
    // await historyService.create(...)
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <h2>Ders Seç → Soru Üret</h2>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        {/* DERSLER */}
        <div>
          <h3>Dersler</h3>
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              style={{
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                cursor: "pointer",
                background:
                  selectedLesson?.id === lesson.id ? "#e0f2fe" : "#f9f9f9",
                border: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: 600 }}>{lesson.title}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                difficulty: {lesson.difficulty}
              </div>
            </div>
          ))}
        </div>

        {/* SORU FORM */}
        <div>
          <h3>Soru</h3>

          {!selectedLesson && <p>Bir ders seçiniz</p>}
          {loading && <p>⏳ Soru getiriliyor...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {question && (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                background: "#fff",
              }}
            >
              <div style={{ marginBottom: 10, fontWeight: 600, color: "#2563eb" }}>
                ⏱ Süre: {seconds} sn
              </div>

              <div style={{ marginBottom: 10, opacity: 0.7 }}>
                Zorluk: <b>{question.difficulty}</b>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Soru</label>
                <div
                  style={{
                    marginTop: 6,
                    padding: 12,
                    background: "#f3f4f6",
                    borderRadius: 6,
                  }}
                >
                  {question.text}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Cevabınız</label>
                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Cevabınızı yazınız"
                  style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 6,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <button
                onClick={handleAnswerSubmit}
                disabled={!answer.trim()}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  opacity: !answer.trim() ? 0.5 : 1,
                }}
              >
                Cevapla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
