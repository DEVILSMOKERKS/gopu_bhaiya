'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import './BestSeller.css';
import BestSeller1 from '../../assets/img/Bestseller1.jpg'
import BestSeller2 from '../../assets/img/Bestseller2.jpg'
import BestSeller3 from '../../assets/img/Bestseller3.jpg'

const BestSeller = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});
  const [bestSellerData, setBestSellerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const router = useRouter();
  const { addToWishlist, isInWishlist, removeFromWishlistByProduct, buyNow } = useWishlistCart();

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch bestseller products from API
  useEffect(() => {
    const fetchBestsellerProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/bestsellers?limit=10`);

        if (response.data.success) {
          // Transform API data to match the existing UI structure
          const transformedData = response.data.data.map((product, index) => ({
            id: product.product_id,
            name: product.name,
            description: product.description || 'Premium Quality Product',
            price: `₹${(product.min_price || 0).toLocaleString()}`,
            // Preserve original API data for wishlist functionality
            originalProduct: product,
            colors: product.colors && product.colors.length > 0
              ? product.colors.map((color, colorIndex) => ({
                color: color.color_code || '#000000',
                name: color.color_name || 'Default',
                image: color.images && color.images.length > 0
                  ? `${API_URL.replace('/api', '')}${color.images[0]}`
                  : [BestSeller1, BestSeller2, BestSeller3][colorIndex % 3]
              }))
              : [
                {
                  color: '#000000',
                  name: 'Black',
                  image: BestSeller1
                },
                {
                  color: '#87CEEB',
                  name: 'Light Blue',
                  image: BestSeller2
                },
                {
                  color: '#808000',
                  name: 'Olive Green',
                  image: BestSeller3
                }
              ]
          }));

          setBestSellerData(transformedData);
        } else {
          setError('Failed to fetch bestseller products');
          setBestSellerData([]);
        }
      } catch (err) {
        console.error('Error fetching bestseller products:', err);
        setError('Error loading bestseller products');
        setBestSellerData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellerProducts();
  }, [API_URL]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === bestSellerData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bestSellerData.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleColorSelect = (productId, colorIndex) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: colorIndex
    }));
  };

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  const handleViewAllClick = (e) => {
    e.preventDefault();
    router.push('/shop');
  };

  const handleBuyNow = (item) => {
    // Get the first available size and color for quick buy
    const firstSize = item.originalProduct.sizes && item.originalProduct.sizes.length > 0
      ? item.originalProduct.sizes[0]
      : { size_id: null, size: 'One Size', sell_price: item.originalProduct.min_price || 0 };

    const firstColor = item.originalProduct.colors && item.originalProduct.colors.length > 0
      ? item.originalProduct.colors[0]
      : { color_id: null, color_name: 'Default' };

    const cartData = {
      product_id: item.id,
      color_id: firstColor.color_id,
      size_id: firstSize.size_id,
      quantity: 1,
      size_name: firstSize.size,
      color_name: firstColor.color_name,
      sell_price: firstSize.sell_price,
      product: {
        product_id: item.id,
        name: item.name,
        description: item.description,
        price: firstSize.sell_price,
        image: getCurrentImage(item)
      }
    };

    // Use the buyNow function from context
    buyNow(cartData, navigate);
  };

  const getCurrentImage = (product) => {
    const selectedColorIndex = selectedColors[product.id] || 0;
    return product.colors[selectedColorIndex].image;
  };

  useEffect(() => {
    if (carouselRef.current && bestSellerData.length > 0) {
      const cardWidth = carouselRef.current.offsetWidth / 3; // Show 3 cards at a time
      carouselRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, bestSellerData]);

  // Show loading state
  if (loading) {
    return (
      <div className="bestseller-container">
        <div className="bestseller-header">
          <h2 className="bestseller-title">Best Sellers</h2>
          <button onClick={handleViewAllClick} className="bestseller-view-all">View All</button>
        </div>
        <div className="bestseller-loading">
          <div className="bestseller-loading-spinner"></div>
          <p>Loading bestseller products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bestseller-container">
        <div className="bestseller-header">
          <h2 className="bestseller-title">Best Sellers</h2>
          <button onClick={handleViewAllClick} className="bestseller-view-all">View All</button>
        </div>
        <div className="bestseller-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show no products available state
  if (bestSellerData.length === 0) {
    return (
      <div className="bestseller-container">
        <div className="bestseller-header">
          <h2 className="bestseller-title">Best Sellers</h2>
          <button onClick={handleViewAllClick} className="bestseller-view-all">View All</button>
        </div>
        <div className="bestseller-no-products">
          <div className="bestseller-no-products-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>No Bestseller Products Available</h3>
          <p>Check back later for our latest bestseller products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bestseller-container">
      <div className="bestseller-header">
        <h2 className="bestseller-title">Best Sellers</h2>
        <button onClick={handleViewAllClick} className="bestseller-view-all">View All</button>
      </div>

      <div className="bestseller-carousel-wrapper">
        <button
          className="bestseller-nav-btn bestseller-prev-btn"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="bestseller-carousel" ref={carouselRef}>
          {bestSellerData.map((item, index) => (
            <div
              key={item.id}
              className={`bestseller-card ${index === currentIndex ? 'bestseller-active' : ''}`}
              onClick={() => handleProductClick(item.id)}
            >
              <div className="bestseller-card-image-container">
                <img
                  src={getCurrentImage(item)}
                  alt={`${item.name} product`}
                  className="bestseller-card-image"
                  loading="lazy"
                />
                <button
                  className={`bestseller-heart-btn ${isInWishlist(item.id) ? 'bestseller-heart-btn-active' : ''}`}
                  aria-label={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isInWishlist(item.id)) {
                      // Remove from wishlist by product ID
                      removeFromWishlistByProduct(item.id);
                    } else {
                      addToWishlist({
                        product_id: item.id,
                        product: {
                          product_id: item.id,
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          min_price: item.originalProduct.min_price || 0,
                          colors: item.originalProduct.colors || [],
                          sizes: item.originalProduct.sizes || [],
                          image: getCurrentImage(item)
                        }
                      });
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(item.id) ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="bestseller-card-content">
                <h3 className="bestseller-product-name">{item.name}</h3>
                <p className="bestseller-product-description">{item.description}</p>
                <div className="bestseller-price-colors">
                  <span className="bestseller-price">{item.price}</span>
                  <div className="bestseller-color-swatches">
                    {item.colors.map((colorData, colorIndex) => (
                      <div
                        key={colorIndex}
                        className={`bestseller-color-swatch ${selectedColors[item.id] === colorIndex ? 'bestseller-color-swatch-active' : ''}`}
                        style={{ backgroundColor: colorData.color }}
                        title={colorData.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleColorSelect(item.id, colorIndex);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="bestseller-actions">
                  {/* <button 
                    className="bestseller-buy-now-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(item);
                    }}
                  >
                    Buy Now
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="bestseller-nav-btn bestseller-next-btn"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BestSeller;
