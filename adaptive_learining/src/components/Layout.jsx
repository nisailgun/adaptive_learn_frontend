import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import PrepareMeModal from "./PrepareMeModal";

export default function Layout() {
  const token = localStorage.getItem("token");
  const [showPrepare, setShowPrepare] = useState(false);

  return (
    <>
      <Navbar />

      {!token ? (
        <div className="page">
          <div className="container">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="appShell">
          <aside className="side">
            <div className="sideSection">
              <div className="sideTitle">LEARN</div>

              <NavLink to="/dashboard" className="sideItem">
                🏠 Dashboard
              </NavLink>

              <NavLink to="/lessons" className="sideItem">
                📚 Lessons
              </NavLink>

              <NavLink to="/questions" className="sideItem">
                ❓ Questions
              </NavLink>

              <NavLink to="/history" className="sideItem">
                🕘 History
              </NavLink>
            </div>

            <div className="sideSection">
              <div className="sideTitle">PRACTICE</div>

              {/* ARTIK AKTİF */}
              <div
                className="sideItem"
                onClick={() => setShowPrepare(true)}
                style={{ cursor: "pointer" }}
              >
                🧠 Prepare Me
              </div>

              <div className="sideItem muted">💬 Talk Loop</div>
              <div className="sideItem muted">📝 Review Mode</div>
            </div>
          </aside>

          <main className="mainArea">
            <Outlet />
          </main>
        </div>
      )}

      {showPrepare && (
        <PrepareMeModal onClose={() => setShowPrepare(false)} />
      )}
    </>
  );
}
