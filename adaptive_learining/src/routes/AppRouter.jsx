import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Lessons from "../pages/Lessons";
import Questions from "../pages/Questions";
import History from "../pages/History";
import LessonQuestionGenerator from "../pages/Solving";


function ProtectedRoute() {
  const token = localStorage.getItem("token");
  return token ? <Layout /> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public pages (Layout is optional here. İstersen Login/Register da Layout'suz olsun) */}
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/history" element={<History />} />
        <Route path="/solving" element={<LessonQuestionGenerator/>}/>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
