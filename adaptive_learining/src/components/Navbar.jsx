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
    <div style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <strong>Adaptive Learn</strong>
      {token && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/lessons">Lessons</Link>
          <Link to="/questions">Questions</Link>
          <Link to="/history">History</Link>
          <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
        </>
      )}
      {!token && (
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
}
