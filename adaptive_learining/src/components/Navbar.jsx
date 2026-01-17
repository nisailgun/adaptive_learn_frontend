import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    authService.logout();
    nav("/login");
  }

  return (
    <nav className="nav">
      <div className="container navInner">
        <div className="brand">
          <strong>Adaptive Learn</strong>
        </div>

        {token && (
          <div className="navLinks">
            <Link className="navLink" to="/dashboard">Dashboard</Link>
            <Link className="navLink" to="/lessons">Lessons</Link>
            <Link className="navLink" to="/questions">Questions</Link>
            <Link className="navLink" to="/history">History</Link>

            <button onClick={logout} className="btn ghost" style={{ marginLeft: 8 }}>
              Logout
            </button>
          </div>
        )}

        {!token && (
          <div className="navLinks">
            <Link className="navLink" to="/login">Login</Link>
            <Link className="navLink" to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
