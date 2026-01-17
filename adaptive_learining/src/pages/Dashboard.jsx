import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Dashboard() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);

  useEffect(() => {
    authService
      .me()
      .then((r) => setMe(r.data))
      .catch(() => setMe(null));
  }, []);

  function logout() {
    authService.logout();
    nav("/login");
  }

  const xpCurrent = 0;
  const xpGoal = 50;
  const xpPct = Math.min(100, Math.round((xpCurrent / xpGoal) * 100));

  return (
    <div className="page">
      <div className="container">
        <div className="dashGrid">
          {/* LEFT: Goal */}
          <div className="card grad pad">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div className="kicker">Today's Goal</div>
                <div className="big">
                  {xpCurrent} / {xpGoal} XP
                </div>
              </div>
              <span className="badge">In Progress</span>
            </div>

            <div className="progress">
              <div className="progressBar" style={{ width: `${xpPct}%` }} />
            </div>

            <div className="mutedText">
              Complete a lesson to reach your goal.
            </div>

            <div className="divider" />

            {/* User info (same logic) */}
            {me ? (
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <div className="kicker">Signed in as</div>
                  <div style={{ fontWeight: 900 }}>{me.email}</div>
                  <div className="mutedText" style={{ marginTop: 6 }}>
                    role: <b>{me.role}</b>
                  </div>
                </div>
                <button onClick={logout} className="btn ghost">
                  Log out
                </button>
              </div>
            ) : (
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <div className="kicker">User</div>
                  <div className="mutedText">
                    User info not loaded (token invalid?).
                  </div>
                </div>
                <button onClick={logout} className="btn ghost">
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Skills */}
          <div className="card pad">
            <div className="kicker">Skills</div>
            <div className="skillsRow">
              <div className="skillRing">
                <div className="skillPct">0%</div>
                <div className="skillLbl">Daily XP</div>
              </div>
              <div className="skillRing">
                <div className="skillPct">0%</div>
                <div className="skillLbl">Grammar</div>
              </div>
              <div className="skillRing">
                <div className="skillPct">0%</div>
                <div className="skillLbl">Words</div>
              </div>
            </div>
          </div>

          {/* LEFT: Quick Start */}
          <div className="card pad">
            <div className="kicker">Quick Start</div>
            <div className="quickGrid">
              <div className="quickCard green">📘 Daily Lesson</div>
              <div className="quickCard gray">⚡ Grammar Sprint</div>
              <div className="quickCard gray">🧩 Word Sprint</div>
              <div className="quickCard orange">🎤 Practice Speaking</div>
            </div>
          </div>

          {/* RIGHT: Achievements */}
          <div className="card pad">
            <div className="kicker">Recent Achievements</div>
            <div className="mutedText">Loading...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
