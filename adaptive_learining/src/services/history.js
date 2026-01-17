import axios from "axios";

const API_BASE = "http://localhost:8000/history"; // backend URL’ine göre değiştir

// -------------------
// GET ALL
// -------------------
export const getAllHistory = () => {
  return axios.get(`${API_BASE}/`);
};

// -------------------
// GET BY STUDENT EMAIL
// -------------------
export const getHistoryByEmail = (email) => {
  return axios.get(`${API_BASE}/by-email`, {
    params: { email },
  });
};

// -------------------
// CREATE
// -------------------
export const createHistory = (history) => {
  // history = { student_id, question_id, time_taken_seconds, correct, answered_at (opsiyonel) }
  return axios.post(`${API_BASE}/`, history);
};

// -------------------
// UPDATE
// -------------------
export const updateHistory = (historyId, history) => {
  // history = { student_id?, question_id?, time_taken_seconds?, correct? }
  return axios.put(`${API_BASE}/${historyId}`, history);
};

// -------------------
// DELETE
// -------------------
export const deleteHistory = (historyId) => {
  return axios.delete(`${API_BASE}/${historyId}`);
};
