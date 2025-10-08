import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "../Components/Google_login";
import "./Login.css";
import { API_BASE_URL } from "../utils/api";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ email, password }), // or username if your backend uses it
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ fetch the logged-in user
        const userRes = await fetch(`${API_BASE_URL}/api/auth/user/`, {
          credentials: "include",
        });
        const userData = await userRes.json();
        setUser(userData);
        navigate("/");
      } else {
        setError(data.detail || JSON.stringify(data));
      }
    } catch (err) {
      setError("Network error. Make sure the backend is running.");
    }
  };

<GoogleLogin onLoginSuccess={async () => {
  // after popup closes → fetch current user
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/user/`, {
      credentials: "include",
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      navigate("/");
    }
  } catch (err) {
    console.error("Error refreshing user after Google login:", err);
  }
}} />


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
          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="divider">or continue with</div>
        <GoogleLogin />

        <div className="signup-text">
          Don’t have an account?{" "}
          <button className="signup-btn" onClick={() => navigate("/registration")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
