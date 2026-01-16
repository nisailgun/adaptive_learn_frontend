import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Lessons from "../pages/Lessons";
import Questions from "../pages/Questions";
import History from "../pages/History";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      }/>

      <Route path="/lessons" element={
        <ProtectedRoute>
          <Layout><Lessons /></Layout>
        </ProtectedRoute>
      }/>

      <Route path="/questions" element={
        <ProtectedRoute>
          <Layout><Questions /></Layout>
        </ProtectedRoute>
      }/>

      <Route path="/history" element={
        <ProtectedRoute>
          <Layout><History /></Layout>
        </ProtectedRoute>
      }/>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
