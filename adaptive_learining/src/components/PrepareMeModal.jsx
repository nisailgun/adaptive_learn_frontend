import { useEffect, useState } from "react";

export default function PrepareMeModal({ onClose }) {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  // Dersleri çek
  useEffect(() => {
    fetch("http://localhost:8000/lessons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setLessons);
  }, []);

  const generate = async () => {
    if (!selectedLesson) return;

    setLoading(true);
    setResult(null);

    const res = await fetch(
      `http://localhost:8000/lessons/${selectedLesson}/ai-generate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <>
      <style>
        {`
        .modalBackdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal {
          background: #ffffff;
          width: 650px;
          max-height: 85vh;
          padding: 24px;
          border-radius: 10px;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal h2 {
          margin-bottom: 16px;
        }

        .modal select {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .modal button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          margin-top: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .modal button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .primaryBtn {
          background: #2563eb;
          color: white;
        }

        .closeBtn {
          background: #e5e7eb;
          margin-top: 14px;
        }

        .aiResult {
          margin-top: 20px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px;
        }

        .aiResult h3 {
          margin-bottom: 4px;
        }

        .aiResult pre {
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 13px;
          margin-top: 10px;
        }
        `}
      </style>

      <div className="modalBackdrop">
        <div className="modal">
          <h2>🧠 Prepare Me</h2>

          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
          >
            <option value="">Ders seç</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} ({l.difficulty})
              </option>
            ))}
          </select>

          <button
            className="primaryBtn"
            onClick={generate}
            disabled={loading}
          >
            {loading ? "AI hazırlanıyor..." : "AI ile Hazırla"}
          </button>

          {result && (
            <div className="aiResult">
              <h3>{result.lesson_title}</h3>
              <p>
                <b>Zorluk:</b> {result.lesson_difficulty}
              </p>

              <pre>{result.ai_response}</pre>
            </div>
          )}

          <button className="closeBtn" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </>
  );
}
