import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CartDropdown.css";
import cart from "../assets/images/cart_icon.png";
import { Ban } from "lucide-react";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function CartDropdown({ cartItems, cartCount, setCartItems, setCartCount, user}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("cartItems in CartDropdown:", cartItems);
  }, [cartItems]);

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/auth/cart/remove/${productId}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart_items);
        setCartCount(data.cart_count);
      } else {
        console.error("Remove from cart failed:", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  if (user) {
    fetch("http://localhost:8000/api/auth/cart/", {
      credentials: "include",
      headers: { "X-CSRFToken": getCookie("csrftoken") }
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data.cart_items);
        setCartCount(data.cart_count);
      })
      .catch(err => console.error("Failed to load cart:", err));
  } else {
    // if logged out, clear cart
    setCartItems([]);
    setCartCount(0);
  }
}, [user]);

  return (
    <div className="cart-dropdown-wrapper">
      <div className="cart-button" onClick={toggleDropdown}>
        <img src={cart} alt="Cart" />
        {cartCount > 0 && <div className="cart-count">{cartCount}</div>}
      </div>

      {isOpen && (
        <div className="cart-dropdown">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-wrapper">
                <Link to={`/products/${item.product.id}`} className="cart-item-link">
                  <div className="cart-item">
                    <img
                      src={`http://localhost:8000${item.product.images?.[0]?.image ?? ""}`}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-price">U${item.product.price}</div>
                  </div>
                </Link>
                <button
                  className="remove-from-cart-btn"
                  onClick={() => handleRemove(item.product.id)}
                >
                  <Ban />
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <button className="checkout-button">Checkout</button>
        </div>
      )}
    </div>
  );
}

export default CartDropdown;