'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useWishlistCart } from '../../../context/wishlistCartContext';
import { sampleProducts } from '../../../data/productsData';
import './MateshwariCollection.css';

const MateshwariCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistCart();

  useEffect(() => {
    // Fetch products from productsData.js
    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const getProductImage = (product) => {
    // Get image from direct images key
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      // If image is an imported module (not a string), return it directly
      if (typeof image !== 'string') {
        return image;
      }
      // If it's a string path, return it as is
      return image;
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

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  // For mobile: calculate pagination
  const itemsPerPage = 2;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const mobileProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading) {
    return (
      <section className="mateshwari-collection">
        <div className="mateshwari-collection-container">
          <h2 className="mateshwari-collection-title">Mateshwari Collection</h2>
          <div className="mateshwari-collection-loading">Loading...</div>
        </div>
      </section>
    );
  }

  // Empty state - show clean empty state UI
  if (products.length === 0) {
    return (
      <section className="mateshwari-collection">
        <div className="mateshwari-collection-container">
          <h2 className="mateshwari-collection-title">Mateshwari Collection</h2>
          <div className="mateshwari-collection-empty-state">
            <div className="mateshwari-collection-empty-icon-wrapper">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 21V13C16 11.8954 15.1046 11 14 11H10C8.89543 11 8 11.8954 8 13V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 10L12 15L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mateshwari-collection-empty-title">No Products Available</h3>
            <p className="mateshwari-collection-empty-message">
              We're currently updating our collection. Please check back soon for new arrivals.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mateshwari-collection">
      <div className="mateshwari-collection-container">
        <h2 className="mateshwari-collection-title">Mateshwari Collection</h2>

        {/* Desktop: Show 5 products */}
        <div className="mateshwari-collection-grid-desktop">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.product_id}
              className="mateshwari-collection-card"
              onClick={() => handleProductClick(product.product_id)}
            >
              <div className="mateshwari-collection-image-wrapper">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="mateshwari-collection-image"
                />
                <button
                  className="mateshwari-collection-wishlist-btn"
                  onClick={(e) => handleWishlistToggle(e, product)}
                  aria-label="Add to wishlist"
                >
                  {isInWishlist(product.product_id) ? (
                    <HiHeart className="mateshwari-collection-wishlist-icon filled" />
                  ) : (
                    <HiOutlineHeart className="mateshwari-collection-wishlist-icon" />
                  )}
                </button>
              </div>
              <h3 className="mateshwari-collection-card-title">{product.name}</h3>
            </div>
          ))}
        </div>

        {/* Mobile: Show 2 products with pagination */}
        <div className="mateshwari-collection-grid-mobile">
          {mobileProducts.map((product) => (
            <div
              key={product.product_id}
              className="mateshwari-collection-card"
              onClick={() => handleProductClick(product.product_id)}
            >
              <div className="mateshwari-collection-image-wrapper">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="mateshwari-collection-image"
                />
                <button
                  className="mateshwari-collection-wishlist-btn"
                  onClick={(e) => handleWishlistToggle(e, product)}
                  aria-label="Add to wishlist"
                >
                  {isInWishlist(product.product_id) ? (
                    <HiHeart className="mateshwari-collection-wishlist-icon filled" />
                  ) : (
                    <HiOutlineHeart className="mateshwari-collection-wishlist-icon" />
                  )}
                </button>
              </div>
              <h3 className="mateshwari-collection-card-title">{product.name}</h3>
            </div>
          ))}
        </div>

        {/* Pagination Dots - Mobile Only */}
        {totalPages > 1 && (
          <div className="mateshwari-collection-pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`mateshwari-collection-dot ${currentPage === index ? 'active' : ''}`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MateshwariCollection;
