import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sign_in.css";
import { API_BASE_URL } from "../utils/api";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/registration/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password1, password2 }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(
          data.detail ||
          Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(", ")
        );
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password1} onChange={e => setPassword1(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={password2} onChange={e => setPassword2(e.target.value)} required />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="signupbtn" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
