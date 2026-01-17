import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/lessons", // FastAPI URL
});

export const getLessons = () => api.get("/");
export const createLesson = (lesson) => api.post("/", lesson);
export const updateLesson = (id, lesson) => api.put(`/${id}`, lesson);
export const deleteLesson = (id) => api.delete(`/${id}`);
