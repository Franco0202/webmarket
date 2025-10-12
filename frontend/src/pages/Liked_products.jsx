import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Liked_product.css";
import Navbar from "../Components/Navbar";
import LikeButton from "../Components/Like_button";
import { API_BASE_URL } from "../utils/api";

function LikedProducts({ user, setUser, cartItems, setCartItems, cartCount, setCartCount, loadingUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Wait for user loading to finish before redirecting
  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    }
  }, [user, loadingUser, navigate]);

  
  useEffect(() => {
    if (!user) return; // don't fetch if no user

    const fetchLikes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/likes/`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch liked products:", res.status);
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching liked products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [user]);

  if (loading) return <p>Loading liked products...</p>;
  if (products.length === 0)
    return <p>You haven’t liked any products yet. Start exploring and liking products!</p>;

  return (
    <div className="liked-products">
      <Navbar
        user={user}
        setUser={setUser}
        setCartItems={setCartItems}
        setCartCount={setCartCount}
        cartItems={cartItems}
        cartCount={cartCount}
      />

      {products.map((p) => (
        <div className="liked-product-card" key={p.id}>
          <Link to={`/products/${p.id}`} className="liked-product-card-link">
            {p.images?.length > 0 && (
              <img
                src={p.images[0]?.image}
                alt={p.name}
              />
            )}
            <div className="liked-product-info">
              <h3>{p.name}</h3>
              <p>US$ {p.price}</p>
            </div>
            <p className="liked-product-text">{p.text}</p>
          </Link>

          <div className="like">
            <LikeButton productId={p.id} user={user} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LikedProducts;
