import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useWishlistCart } from '../../../context/wishlistCartContext';
import './MateshwariCollection.css';

const MateshwariCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistCart();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?limit=8`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0) {
      return `${API_URL.replace('/api', '')}${product.colors[0].images[0]}`;
    }
    return 'https://via.placeholder.com/300x400/8B4513/FFFFFF?text=Product';
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.product_id)) {
      removeFromWishlist(product.product_id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <section className="mateshwari-collection">
        <div className="container">
          <h2 className="section-title">Mateshwari Collection</h2>
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mateshwari-collection">
      <div className="container">
        <h2 className="section-title">Mateshwari Collection</h2>
        <div className="collection-grid">
          {products.map((product) => (
            <div key={product.product_id} className="collection-card">
              <div className="card-image-wrapper">
                <img 
                  src={getProductImage(product)} 
                  alt={product.name}
                  className="card-image"
                />
                <button
                  className="wishlist-btn"
                  onClick={(e) => handleWishlistToggle(e, product)}
                  aria-label="Add to wishlist"
                >
                  {isInWishlist(product.product_id) ? (
                    <HiHeart className="wishlist-icon filled" />
                  ) : (
                    <HiOutlineHeart className="wishlist-icon" />
                  )}
                </button>
                <button
                  className="view-btn"
                  onClick={() => handleViewClick(product.product_id)}
                >
                  View
                </button>
              </div>
              <div className="card-content">
                <h3 className="card-title">{product.name}</h3>
                <p className="card-price">₹{product.min_price?.toLocaleString() || 'Price on request'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MateshwariCollection;

