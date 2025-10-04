function GoogleLogin() {
  const handleGoogleLogin = () => {
    window.location.href = "https://webmarket-5sfc.onrender.com/accounts/google/login/?process=login";
  };

  return (
    <button onClick={handleGoogleLogin} /* styles… */>
      <img src="/google-icon.png" alt="Google" />
      Sign in with Google
    </button>
  );
}

export default GoogleLogin;
