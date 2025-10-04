import { ShoppingCart, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AddtoCart.css";

function CartButton({ productId, cartItems = [], setCartCount, setCartItems, user }) {
  const isInCart = cartItems.some((item) => item.product.id === productId);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }


  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auth/cart/add/${productId}/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart_items || []);
        setCartCount(data.cart_count || 0);
      } else {
        console.error("Add to cart failed:", res.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auth/cart/remove/${productId}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart_items || []);
        setCartCount(data.cart_count || 0);
      } else {
        console.error("Remove from cart failed:", res.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
      disabled={isLoading}
      className="AddtoCart"
    >
      {isInCart ? (
        <>
          <Ban size={20} />
          {isLoading ? "Removing..." : "Remove from Cart"}
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          {isLoading ? "Adding..." : "Add to Cart"}
        </>
      )}
    </button>
  );
}

export default CartButton;
