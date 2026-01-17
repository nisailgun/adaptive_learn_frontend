import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />

      {/* Login/Register sayfalarında sidebar göstermeyelim */}
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

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `sideItem ${isActive ? "active" : ""}`
                }
              >
                🏠 Dashboard
              </NavLink>

              <NavLink
                to="/lessons"
                className={({ isActive }) =>
                  `sideItem ${isActive ? "active" : ""}`
                }
              >
                📚 Lessons
              </NavLink>

              <NavLink
                to="/questions"
                className={({ isActive }) =>
                  `sideItem ${isActive ? "active" : ""}`
                }
              >
                ❓ Questions
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `sideItem ${isActive ? "active" : ""}`
                }
              >
                🕘 History
              </NavLink>
            </div>

            <div className="sideSection">
              <div className="sideTitle">PRACTICE</div>
              <div className="sideItem muted">🧠 Prepare Me</div>
              <div className="sideItem muted">💬 Talk Loop</div>
              <div className="sideItem muted">📝 Review Mode</div>
            </div>
          </aside>

          <main className="mainArea">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
