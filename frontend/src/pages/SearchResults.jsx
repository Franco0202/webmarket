import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchResults.css";
import CartButton from "../Components/AddtoCart";
import LikeButton from "../Components/Like_button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({setCartCount, setCartItems, user}) {
  const queryParam = useQuery().get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/products/search/?q=${encodeURIComponent(queryParam)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (queryParam) fetchResults();
  }, [queryParam]);

  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No products found for "{queryParam}"</p>;

  return (
    <div className="product-container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <Link to={`/products/${product.id}`} className="product-link">
            {product.images?.length > 0 && (
              <img src={`${API_BASE_URL}${product.images[0].image}`} alt={product.name} />
            )}
            <h3>{product.name}</h3>
          </Link>

          <div className="price">
            <span className="currency">US$</span>
            <span className="amount">{product.price}</span>
          </div>

          <div className="like-cart">
            <CartButton
              productId={product.id}
              setCartCount={setCartCount}
              setCartItems={setCartItems}
              user={user}
            />
            <LikeButton productId={product.id} user={user} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
