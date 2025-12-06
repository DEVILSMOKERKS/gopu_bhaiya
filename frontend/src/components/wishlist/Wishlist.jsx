'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistCart } from '../../context/wishlistCartContext';
import './Wishlist.css';

// Placeholder image path
const placeholderImage = '/placeholder-product.jpg';

const Wishlist = () => {
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const { wishlist, removeFromWishlist, addToCart, loading, error } = useWishlistCart();
  const router = useRouter();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Available sizes for products
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleColorSelect = (productId, colorIndex) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: colorIndex
    }));
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const getCurrentImage = (item) => {
    // Handle both logged-in and non-logged-in data structures
    const product = item.product || item;

    if (product.colors && product.colors.length > 0) {
      const itemId = item.wishlist_id || item.id;
      const selectedColorIndex = selectedColors[itemId] || 0;
      const selectedColor = product.colors[selectedColorIndex];
      if (selectedColor && selectedColor.images && selectedColor.images.length > 0) {
        return `${API_URL.replace('/api', '')}${selectedColor.images[0]}`;
      }
    }

    // Fallback to a default image if no colors are available
    return placeholderImage;
  };

  const getCurrentPrice = (item) => {
    // Handle both logged-in and non-logged-in data structures
    const product = item.product || item;
    const itemId = item.wishlist_id || item.id;
    const selectedSize = selectedSizes[itemId];

    if (product.sizes && product.sizes.length > 0) {
      if (selectedSize) {
        const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
        if (selectedSizeData) {
          return `₹${selectedSizeData.sell_price.toLocaleString()}`;
        }
      }
      // If no size selected, show the first size price
      return `₹${product.sizes[0].sell_price.toLocaleString()}`;
    }

    // Fallback to min_price if available
    if (product.min_price) {
      return `₹${product.min_price.toLocaleString()}`;
    }

    // Fallback to product price
    return product.price || 'Price not available';
  };

  const handleRemoveFromWishlist = (item) => {
    if (item.wishlist_id) {
      removeFromWishlist(item.wishlist_id);
    }
  };

  const handleAddToCart = (item) => {
    // Handle both logged-in and non-logged-in data structures
    const product = item.product || item;
    const itemId = item.wishlist_id || item.id;
    const selectedSize = selectedSizes[itemId];
    const selectedColorIndex = selectedColors[itemId] || 0;

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size before adding to cart');
      return;
    }

    // Find the selected color and size data
    const selectedColor = product.colors && product.colors[selectedColorIndex];
    const selectedSizeData = product.sizes && product.sizes.find(size => size.size === selectedSize);

    if (product.sizes && (!selectedColor || !selectedSizeData)) {
      alert('Please select both color and size');
      return;
    }

    // Prepare cart item data
    const cartItemData = {
      product_id: item.product_id || product.product_id || product.id,
      color_id: selectedColor?.color_id || null,
      size_id: selectedSizeData?.size_id || null,
      quantity: 1,
      product: product,
      size_name: selectedSizeData?.size || null,
      color_name: selectedColor?.color_name || null,
      sell_price: selectedSizeData?.sell_price || product.min_price || product.price
    };

    // Add to cart using context
    addToCart(cartItemData);

    // Show success message
    alert('Item added to cart successfully!');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2 className="wishlist-title">My Wishlist</h2>
        </div>
        <div className="wishlist-loading">
          <div className="wishlist-loading-spinner"></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2 className="wishlist-title">My Wishlist</h2>
        </div>
        <div className="wishlist-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const wishlistItems = wishlist?.items || [];

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2 className="wishlist-title">My Wishlist ({wishlistItems.length} items)</h2>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="wishlist-empty-title">Your wishlist is empty</h3>
          <p className="wishlist-empty-description">Start adding items to your wishlist to see them here</p>
          <button className="wishlist-empty-btn" onClick={() => router.push('/shop')}>Start Shopping</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            const itemId = item.wishlist_id || item.id;

            return (
              <div key={itemId} className="wishlist-card">
                <div className="wishlist-card-image-container">
                  <img
                    src={getCurrentImage(item)}
                    alt={`${product.name || 'Product'} product`}
                    className="wishlist-card-image"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                  <button
                    className="wishlist-remove-btn"
                    aria-label="Remove from wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="wishlist-card-content">
                  <h3 className="wishlist-product-name">{product.name || 'Product Name Not Available'}</h3>
                  <p className="wishlist-product-description">{product.description || 'Product description not available'}</p>
                  <div className="wishlist-price-colors">
                    <span className="wishlist-price">
                      {getCurrentPrice(item)}
                    </span>
                    {product.colors && product.colors.length > 0 && (
                      <div className="wishlist-color-swatches">
                        {product.colors.map((colorData, colorIndex) => (
                          <div
                            key={colorIndex}
                            className={`wishlist-color-swatch ${selectedColors[itemId] === colorIndex ? 'wishlist-color-swatch-active' : ''}`}
                            style={{ backgroundColor: colorData.color_code || '#000000' }}
                            title={colorData.color_name}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorSelect(itemId, colorIndex);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="wishlist-size-section">
                      <h4 className="wishlist-size-title">Select Size:</h4>
                      <div className="wishlist-size-options">
                        {product.sizes.map((sizeData) => (
                          <button
                            key={sizeData.size_id}
                            className={`wishlist-size-btn ${selectedSizes[itemId] === sizeData.size ? 'wishlist-size-btn-active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSizeSelect(itemId, sizeData.size);
                            }}
                          >
                            {sizeData.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    className="wishlist-add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;


