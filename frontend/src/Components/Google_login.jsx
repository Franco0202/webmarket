import { API_BASE_URL } from "../utils/api";
import { FaGoogle } from "react-icons/fa";
import "./Google_login.css";

function GoogleLogin({ onLoginSuccess }) {
  const handleGoogleLogin = () => {
    const next = window.location.origin; // where Google should redirect after login
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    // open popup
    const popup = window.open(
      `${API_BASE_URL}/accounts/google/login/?process=login&next=${encodeURIComponent(next)}`,
      "googleLoginPopup",
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
    );

    // listen for the popup to close and refresh user info
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        if (onLoginSuccess) onLoginSuccess(); // callback for parent to refresh user state
      }
    }, 500);
  };

  return (
    <button onClick={handleGoogleLogin} className="google-btn">
      <FaGoogle className="google-icon" />
    </button>
  );
}

export default GoogleLogin;
