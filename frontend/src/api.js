import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  // Always use a fresh Firebase ID token (avoids expired token issues)
  const token =
    auth.currentUser ? await auth.currentUser.getIdToken() : localStorage.getItem("firebase_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

