import "./Product_detail.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import LikeButton from "../Components/Like_button";
import CartButton from "../Components/AddtoCart";
import BuyNow from "../Components/BuyNow"
import { API_BASE_URL } from "../utils/api"; 


function ProductDetail({setCartItems, user, setUser, setCartCount, cartItems, cartCount }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);


useEffect(() => {
  if (product?.images?.length > 0) {
    setMainImage(`${API_BASE_URL}${product.images[0].image}`);
  }
}, [product]);


useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/products/${id}/`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [id]);


const addToCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/cart/add/${id}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ product_id: id, quantity: 1 }),
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart_items || []);
        setCartCount(data.cart_items?.length || 0);
        console.log("Product added to cart:", data);
      } else {
        console.error("Failed to add product to cart:", res.status);
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (

<div className="product-detail-container">
  <Navbar 
      user={user} 
      setUser={setUser}     
      setCartItems={setCartItems}
      setCartCount={setCartCount}
      cartItems={cartItems}
      cartCount={cartCount}
  />


  {/* LEFT COLUMN = images + thumbnails */}
  <div className="product-gallery">
    <div className="image-row">
      {/* Thumbnails column */}
      <div className="thumbnails-vertical">
        {product.images?.map((img, index) => (
          <img
            key={index}
            src={img.image}
            alt={`${product.name} thumbnail ${index + 1}`}
            className="thumbnail-vertical"
            onClick={() => setMainImage(`${API_BASE_URL}${img.image}`)}
          />
        ))}
      </div>

      {/* Main image */}
      <div className="main-image">
        {mainImage && (
            <div className="main-image-container">
          <img src={mainImage} alt={product.name} className="big-image" />
            </div>
        )}
      </div>
    </div>
  </div>

  {/* RIGHT COLUMN = info */}
  <div className="product-info">
    <h1>{product.name}</h1>
    <h2 className="price">US$ {product.price}</h2>
    <p>{product.text}</p>
    <div className= "buttons-row">
    <CartButton
      productId={product.id}
      user={user}
      setCartItems={setCartItems}
      setCartCount={setCartCount}
      cartItems={cartItems}
      cartCount={cartCount}
    />
    <LikeButton productId={product.id} user={user}
    />
    </div>
    <BuyNow/>
  </div>
</div>
  );
}
export default ProductDetail;