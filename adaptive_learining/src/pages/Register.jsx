import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await authService.register({ email, password, role });
      setMsg("Registered ✅ Now login.");
      setTimeout(() => nav("/login"), 600);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Register failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Register</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">student</option>
          <option value="teacher">teacher</option>
          <option value="admin">admin</option>
        </select>

        <button type="submit">Create account</button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
