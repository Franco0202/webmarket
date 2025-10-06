import { API_BASE_URL } from "../utils/api";

function GoogleLogin() {
  const handleGoogleLogin = () => {
    const next = window.location.origin; // where Google sends them back
    window.location.href = `${API_BASE_URL}/accounts/google/login/?process=login&next=${next}`;
  };

  return (
    <button onClick={handleGoogleLogin} className="google-btn">
      <img src="/google-icon.png" alt="Google" className="google-icon" />
    </button>
  );
}

export default GoogleLogin;
