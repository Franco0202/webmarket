import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartButton from "./AddtoCart";
import LikeButton from "./Like_button";
import "./Products.css";
import { API_BASE_URL } from "../utils/api";

function Products({ setCartCount, setCartItems, cartItems, user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/Home/`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);
  return (
    <div className="product-container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <Link to={`/products/${product.id}`} className="product-link">
            {product.images?.length > 0 && (
              <img src={`{product.images[0].image}`} alt={product.name} />
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
              cartItems={cartItems}       
              user={user}
            />
            <LikeButton productId={product.id} user={user} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
