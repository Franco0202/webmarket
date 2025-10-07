let API_BASE_URL = "";

if (window.location.hostname === "localhost") {
  // Local development
  API_BASE_URL = "http://localhost:8000";
} else {
  // Production on Render (or any live server)
  API_BASE_URL = "https://webmarket-q1am.onrender.com";
}

export { API_BASE_URL };