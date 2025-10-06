import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import "./Like_button.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    document.cookie.split(";").forEach(cookie => {
      const c = cookie.trim();
      if (c.startsWith(name + "=")) cookieValue = decodeURIComponent(c.substring(name.length + 1));
    });
  }
  return cookieValue;
}

function LikeButton({ productId, user }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  // Fetch initial liked state
  useEffect(() => {
    if (!user) return; // No need to fetch if user is not logged in
    const fetchLikes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/likes/`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(data.some(p => p.id === productId));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLikes();
  }, [productId, user]);

  // Toggle like
  const handleLike = async () => {
      if (!user) {
      navigate("/login"); // redirect to login if not logged in
      return;
      }
      try {

      const res = await fetch(`${API_BASE_URL}/api/auth/products/${productId}/like/`, {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleLike} className="like-button" aria-label={liked ? "Unlike" : "Like"}>
      {liked ? <Heart color="#ff4b4b" fill="#ff4b4b" /> : <Heart color="#ccc" />}
    </button>
  );
}

export default LikeButton;





