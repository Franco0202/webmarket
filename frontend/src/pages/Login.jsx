import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "../Components/Google_login";
import "./Login.css";
import { API_BASE_URL } from "../utils/api";

// Helper to get CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function LoginPage({setUser}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login/`, 
        {
          method: "POST",
          credentials: "include", // send cookies
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // CSRF token for Django
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
     // 👇 fetch the current user after login
        const userRes = await fetch(`${API_BASE_URL}/api/auth/login/`,  {
          credentials: "include",
        });
        const userData = await userRes.json();
        setUser(userData);  // 👈 update React state

        navigate("/"); // go home
      } else {
        const data = await response.json();
        setError(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      setError("Network error. Make sure Django backend is running.");
    }
  };

  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="divider">or continue with</div>
        <GoogleLogin />

        <div className="signup-text">
          Don’t have an account?{" "}
          <button
            className="signup-btn"
            onClick={() => navigate("/registration")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
