import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Sign_up";
import ProductDetail from "./pages/Product_detail";
import LikedProducts from "./pages/Liked_products";
import SearchResults from "./pages/SearchResults";

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // 1. Fetch user first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/user/", {
          credentials: "include",
          headers: { "X-CSRFToken": getCookie("csrftoken") },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched user:", data);
          setUser(data && data.id ? data : null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // 2. Only fetch cart when user is available
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/cart/", {
          credentials: "include",
          headers: { "X-CSRFToken": getCookie("csrftoken") },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched cart:", data);
          setCartItems(data.cart_items || []);
          setCartCount(data.cart_count || 0);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setCartLoaded(true);
      }
    };

    fetchCart();
  }, [user]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              setUser={setUser}
              cartCount={cartCount}
              cartItems={cartItems}
              setCartCount={setCartCount}
              setCartItems={setCartItems}
              cartLoaded={cartLoaded}
              setCartLoaded={setCartLoaded}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductDetail
              user={user}
              setUser={setUser}
              cartCount={cartCount}
              cartItems={cartItems}
              setCartCount={setCartCount}
              setCartItems={setCartItems}
              cartLoaded={cartLoaded}
              setCartLoaded={setCartLoaded}
            />
          }
        />
        <Route
          path="/likes"
          element={
            <LikedProducts
              user={user}
              setUser={setUser}
              cartCount={cartCount}
              cartItems={cartItems}
              setCartCount={setCartCount}
              setCartItems={setCartItems}
              cartLoaded={cartLoaded}
              setCartLoaded={setCartLoaded}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchResults
              setCartCount={setCartCount}
              setCartItems={setCartItems}
              user={user}
            />
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registration" element={<SignUp setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;