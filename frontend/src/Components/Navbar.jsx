import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import SearchBar from "./Search";
import logo from "../assets/images/webmarket.png";
import CartDropdown from "./CartDropdown";
import { API_BASE_URL } from "../utils/api";





function Navbar({ user, setUser, cartCount = 0, setCartCount = () => {}, cartItems = [], setCartItems = () => {}, }) {

  const navigate = useNavigate();

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


  async function handleLogout() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.ok) {
      console.log("Logout successful");
      setUser(null);          // Update user state
      setCartCount(0);        // Reset cart count
      navigate("/login");     // Redirect to login page
    } else {
      console.error("Logout failed with status:", response.status);
    }
  } catch (err) {
    console.error("Logout failed", err);
  }
}

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault(); // prevent the default Link navigation
      navigate("/login"); // redirect to login
    }

  };

  return (
    <div className="bar-container">
      <div className="webmarket-icon">
        <Link to="/">
          <img src={logo} alt="icon" />
        </Link>
      </div>

      <SearchBar />

      <div className="likes-button">
        <Link to="/likes" onClick={handleClick} >Liked products</Link>
      </div>

      {user ? (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <div className="login-button">
            <Link to="/login">Login</Link>
          </div>
          <div className="signup-button">
            <Link to="/registration">Sign up</Link>
          </div>
        </>
      )}
      
      {/* CART */}
      <CartDropdown   
      cartItems={cartItems}
      cartCount={cartCount}
      setCartItems={setCartItems}
      setCartCount={setCartCount}
      user={user}
      />

    </div>
  );
}

export default Navbar;