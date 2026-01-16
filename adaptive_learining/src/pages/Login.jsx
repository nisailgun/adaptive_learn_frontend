import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await authService.login({ email, password });
      localStorage.setItem("token", res.data.access_token);
      nav("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Login</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button type="submit">Sign in</button>
      </form>

      <p style={{ marginTop: 10 }}>
        No account? <Link to="/register">Register</Link>
      </p>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
