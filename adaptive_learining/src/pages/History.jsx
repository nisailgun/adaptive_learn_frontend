const MOCK = [
  { id: 1, user: "student@mail.com", action: "Completed Lesson: React Basics", date: "2026-01-17" },
  { id: 2, user: "student@mail.com", action: "Answered Question: SOLID", date: "2026-01-17" },
];

export default function History() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>History</h2>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {MOCK.map((x) => (
          <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{x.action}</div>
            <div style={{ opacity: 0.8 }}>
              {x.user} • {x.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
