import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/questions", // FastAPI URL
});

export const getQuestions = () => api.get("/");
export const createQuestion = (question) => api.post("/", question);
export const updateQuestion = (id, question) => api.put(`/${id}`, question);
export const deleteQuestion = (id) => api.delete(`/${id}`);
