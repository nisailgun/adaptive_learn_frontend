import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function Dashboard() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);

  useEffect(() => {
    authService.me().then((r) => setMe(r.data)).catch(() => setMe(null));
  }, []);

  function logout() {
    authService.logout();
    nav("/login");
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      {me ? <p>{me.email} — role: {me.role}</p> : <p>User info not loaded (token invalid?).</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
