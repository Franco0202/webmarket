import React from "react";
import Navbar from "../Components/Navbar";
import Products from "../Components/Products";
import ContactSection from "../Components/ContactSection";
import {useState} from "react";
import { useLocation } from "react-router-dom";

function Home({ user, setUser, cartCount, setCartCount, setCartItems , cartItems, cartLoaded, setCartLoaded }) {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/registration"];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);


  return (
    <div className="App">
      {shouldShowNavbar && (
        <Navbar
          user={user}
          setUser={setUser}
          cartItems={cartItems}
          setCartItems={setCartItems}
          cartCount={cartCount}
          setCartCount={setCartCount}
        />
      )}
      <Products setCartCount={setCartCount} setCartItems={setCartItems} user={user} cartItems={cartItems}/>
      <ContactSection />
    </div>
  );
}

export default Home;
