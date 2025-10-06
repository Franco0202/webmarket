import { API_BASE_URL } from "../utils/api";

function GoogleLogin() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/accounts/google/login/?process=login`;
  };

  return (
    <button onClick={handleGoogleLogin} /* styles… */>
      <img src="/google-icon.png" alt="Google" />
      Sign in with Google
    </button>
  );
}

export default GoogleLogin;
