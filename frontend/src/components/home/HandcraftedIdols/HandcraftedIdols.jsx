import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HandcraftedIdols.css';

const HandcraftedIdols = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products?limit=6`);
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
    return 'https://via.placeholder.com/300x400/8B4513/FFFFFF?text=Idol';
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <section className="handcrafted-idols">
        <div className="container">
          <h2 className="section-title">Handcrafted Idols</h2>
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="handcrafted-idols">
      <div className="container">
        <h2 className="section-title">Handcrafted Idols</h2>
        <div className="idols-grid">
          {products.map((product) => (
            <div 
              key={product.product_id} 
              className="idol-card"
              onClick={() => handleProductClick(product.product_id)}
            >
              <div className="idol-image-wrapper">
                <img 
                  src={getProductImage(product)} 
                  alt={product.name}
                  className="idol-image"
                />
              </div>
              <div className="idol-content">
                <h3 className="idol-title">{product.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HandcraftedIdols;

