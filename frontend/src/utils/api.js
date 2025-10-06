export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://webmarket-q1am.onrender.com"
    : "http://localhost:8000";