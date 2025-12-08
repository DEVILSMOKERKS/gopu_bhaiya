'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import './product.css';
import AlsoLike from '../../components/alsoLike/AlsoLike';
import ProductReview from './ProductReview';

const Product = ({ productId: productIdProp }) => {
  const router = useRouter();
  const productId = productIdProp;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [expandedSections, setExpandedSections] = useState({
    fitting: false,
    fabricCare: true,
    productDetail: false,
    shippingReturn: true
  });
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomModalScale, setZoomModalScale] = useState(1);
  const [zoomModalPosition, setZoomModalPosition] = useState({ x: 0, y: 0 });
  const [isZoomModalDragging, setIsZoomModalDragging] = useState(false);
  const [zoomModalDragStart, setZoomModalDragStart] = useState({ x: 0, y: 0 });
  const { addToCart, buyNow, addToWishlist, isInWishlist, removeFromWishlistByProduct, isInCart } = useWishlistCart();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${productId}`);

        if (response.data.success) {
          setProduct(response.data.data);
          // Set first color as selected by default
          if (response.data.data.colors && response.data.data.colors.length > 0) {
            setSelectedColor(0);
          }
          // Set first size as selected by default
          if (response.data.data.sizes && response.data.data.sizes.length > 0) {
            setSelectedSize(response.data.data.sizes[0].size);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, API_URL]);

  // Facebook Pixel ViewContent tracking
  useEffect(() => {
    if (product && product.product_id) {
      // Track ViewContent event when product is loaded
      if (typeof window !== 'undefined' && window.fbq) {
        try {
          window.fbq('track', 'ViewContent', {
            content_ids: [product.product_id.toString()],
            content_type: 'product',
            content_name: product.name,
            content_category: product.category || 'Fashion',
            value: product.min_price || product.price || 0,
            currency: 'INR'
          });
        } catch (error) {
          console.error('Error tracking ViewContent:', error);
        }
      } else {
        console.warn('Facebook Pixel not loaded');
      }
    }
  }, [product]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleColorSelect = (colorIndex) => {
    setSelectedColor(colorIndex);
    setSelectedImage(0); // Reset to first image when color changes
  };

  const handleSizeSelect = (sizeValue) => {
    setSelectedSize(sizeValue);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }

    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    const selectedColorData = product.colors && product.colors[selectedColor];

    const cartData = {
      product_id: product.product_id,
      color_id: selectedColorData ? selectedColorData.color_id : null,
      size_id: selectedSizeData ? selectedSizeData.size_id : null,
      quantity: 1,
      size_name: selectedSize,
      color_name: selectedColorData ? selectedColorData.color_name : 'Default',
      sell_price: selectedSizeData ? selectedSizeData.sell_price : 0,
      product: {
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        price: selectedSizeData ? selectedSizeData.sell_price : 0,
        image: productImages.length > 0 ? `${API_URL.replace('/api', '')}${productImages[0]}` : '/src/assets/img/Bestseller1.jpg'
      }
    };

    addToCart(cartData);

    // Track AddToCart event
    if (typeof window !== 'undefined' && window.fbq) {
      try {
        window.fbq('track', 'AddToCart', {
          content_ids: [product.product_id.toString()],
          content_type: 'product',
          content_name: product.name,
          content_category: product.category || 'Fashion',
          value: selectedSizeData ? selectedSizeData.sell_price : 0,
          currency: 'INR'
        });
      } catch (error) {
        console.error('Error tracking AddToCart:', error);
      }
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }

    const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
    const selectedColorData = product.colors && product.colors[selectedColor];

    const cartData = {
      product_id: product.product_id,
      color_id: selectedColorData ? selectedColorData.color_id : null,
      size_id: selectedSizeData ? selectedSizeData.size_id : null,
      quantity: 1,
      size_name: selectedSize,
      color_name: selectedColorData ? selectedColorData.color_name : 'Default',
      sell_price: selectedSizeData ? selectedSizeData.sell_price : 0,
      product: {
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        price: selectedSizeData ? selectedSizeData.sell_price : 0,
        image: productImages.length > 0 ? `${API_URL.replace('/api', '')}${productImages[0]}` : '/src/assets/img/Bestseller1.jpg'
      }
    };

    // Use the buyNow function from context
    buyNow(cartData, router);
  };

  // Zoom control functions
  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.5);
      setIsZoomed(true);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(prev => prev - 0.5);
      if (zoomLevel <= 1) {
        setIsZoomed(false);
        setDragOffset({ x: 0, y: 0 });
      }
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleImageClick = () => {
    setShowZoomModal(true);
  };

  const closeZoomModal = () => {
    setShowZoomModal(false);
    setZoomModalScale(1);
    setZoomModalPosition({ x: 0, y: 0 });
  };

  // Zoom modal interactions
  const handleZoomModalTap = (e) => {
    e.stopPropagation();
    if (zoomModalScale === 1) {
      setZoomModalScale(2);
    } else {
      setZoomModalScale(1);
      setZoomModalPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomModalMouseDown = (e) => {
    if (zoomModalScale > 1) {
      e.preventDefault();
      setIsZoomModalDragging(true);
      setZoomModalDragStart({
        x: e.clientX - zoomModalPosition.x,
        y: e.clientY - zoomModalPosition.y
      });
    }
  };

  const handleZoomModalMouseMove = (e) => {
    if (isZoomModalDragging && zoomModalScale > 1) {
      e.preventDefault();
      setZoomModalPosition({
        x: e.clientX - zoomModalDragStart.x,
        y: e.clientY - zoomModalDragStart.y
      });
    }
  };

  const handleZoomModalMouseUp = () => {
    setIsZoomModalDragging(false);
  };

  const handleZoomModalTouchStart = (e) => {
    if (zoomModalScale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setIsZoomModalDragging(true);
      setZoomModalDragStart({
        x: touch.clientX - zoomModalPosition.x,
        y: touch.clientY - zoomModalPosition.y
      });
    }
  };

  const handleZoomModalTouchMove = (e) => {
    if (isZoomModalDragging && zoomModalScale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setZoomModalPosition({
        x: touch.clientX - zoomModalDragStart.x,
        y: touch.clientY - zoomModalDragStart.y
      });
    }
  };

  const handleZoomModalTouchEnd = () => {
    setIsZoomModalDragging(false);
  };

  // Global event listeners for zoom modal
  useEffect(() => {
    if (showZoomModal) {
      const handleGlobalMouseMove = (e) => handleZoomModalMouseMove(e);
      const handleGlobalMouseUp = () => handleZoomModalMouseUp();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [showZoomModal, isZoomModalDragging, zoomModalScale, zoomModalPosition, zoomModalDragStart]);

  // Drag functionality
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };

      // Calculate boundaries to prevent dragging too far
      const maxOffsetX = (zoomLevel - 1) * 150;
      const maxOffsetY = (zoomLevel - 1) * 100;

      setDragOffset({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newOffset.x)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (zoomLevel > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y
      });
      e.preventDefault();
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const touch = e.touches[0];
      const newOffset = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      };

      // Calculate boundaries to prevent dragging too far
      const maxOffsetX = (zoomLevel - 1) * 150;
      const maxOffsetY = (zoomLevel - 1) * 100;

      setDragOffset({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newOffset.x)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newOffset.y))
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Size chart modal handlers
  const openSizeChart = () => {
    setShowSizeChart(true);
  };

  const closeSizeChart = () => {
    setShowSizeChart(false);
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    addToWishlist({
      product_id: product.product_id,
      product: {
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        price: getCurrentPrice(),
        min_price: Math.min(...product.sizes.map(size => size.sell_price)),
        colors: product.colors || [],
        sizes: product.sizes || [],
        image: productImages.length > 0 ? `${API_URL.replace('/api', '')}${productImages[0]}` : '/src/assets/img/Bestseller1.jpg'
      }
    });
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = () => {
    removeFromWishlistByProduct(product.product_id);
  };

  // Get current price based on selected size
  const getCurrentPrice = () => {
    if (!product || !product.sizes || product.sizes.length === 0) {
      return 0;
    }

    if (selectedSize) {
      const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
      return selectedSizeData ? selectedSizeData.sell_price : product.sizes[0].sell_price;
    }

    // Return minimum price if no size is selected
    return Math.min(...product.sizes.map(size => size.sell_price));
  };

  // Get current actual price (MRP) based on selected size
  const getCurrentActualPrice = () => {
    if (!product) {
      return 0;
    }

    // First try to get from product level fields
    const productActualPrice = product.rate || product.mrp || product.actual_price || product.original_price || product.max_price;

    if (!product.sizes || product.sizes.length === 0) {
      return productActualPrice || 0;
    }

    if (selectedSize) {
      const selectedSizeData = product.sizes.find(size => size.size === selectedSize);

      // Try different possible field names for actual price
      const actualPrice = selectedSizeData ? (
        selectedSizeData.rate ||
        selectedSizeData.mrp ||
        selectedSizeData.actual_price ||
        selectedSizeData.original_price ||
        selectedSizeData.price
      ) : (
        product.sizes[0].rate ||
        product.sizes[0].mrp ||
        product.sizes[0].actual_price ||
        product.sizes[0].original_price ||
        product.sizes[0].price
      );

      return actualPrice || productActualPrice || 0;
    }

    // Return minimum actual price if no size is selected
    const minActualPrice = Math.min(...product.sizes.map(size =>
      size.rate || size.mrp || size.actual_price || size.original_price || size.price || 0
    ));
    return minActualPrice || productActualPrice || 0;
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    const actualPrice = getCurrentActualPrice();
    const sellingPrice = getCurrentPrice();

    if (actualPrice <= 0 || sellingPrice >= actualPrice) {
      return 0;
    }

    return Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="product-page">
        <div className="product-loading">
          <div className="product-skeleton">
            {/* Left Column - Image Gallery Skeleton */}
            <div className="product-skeleton-left">
              <div className="skeleton-image-gallery">
                <div className="skeleton-thumbnails">
                  <div className="skeleton-thumbnail"></div>
                  <div className="skeleton-thumbnail"></div>
                  <div className="skeleton-thumbnail"></div>
                  <div className="skeleton-thumbnail"></div>
                </div>
                <div className="skeleton-main-image"></div>
              </div>
            </div>

            {/* Right Column - Product Info Skeleton */}
            <div className="product-skeleton-right">
              <div className="skeleton-breadcrumb"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-description"></div>

              {/* Color Options Skeleton */}
              <div>
                <div style={{ height: '20px', width: '100px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite', borderRadius: '4px', marginBottom: '10px' }}></div>
                <div className="skeleton-color-options">
                  <div className="skeleton-color"></div>
                  <div className="skeleton-color"></div>
                  <div className="skeleton-color"></div>
                  <div className="skeleton-color"></div>
                </div>
              </div>

              {/* Size Options Skeleton */}
              <div>
                <div style={{ height: '20px', width: '80px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 2s infinite', borderRadius: '4px', marginBottom: '10px' }}></div>
                <div className="skeleton-size-options">
                  <div className="skeleton-size"></div>
                  <div className="skeleton-size"></div>
                  <div className="skeleton-size"></div>
                  <div className="skeleton-size"></div>
                  <div className="skeleton-size"></div>
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="skeleton-buttons">
                <div className="skeleton-button primary"></div>
                <div className="skeleton-button secondary"></div>
              </div>

              {/* Sections Skeleton */}
              <div className="skeleton-sections">
                <div className="skeleton-section">
                  <div className="skeleton-section-header"></div>
                  <div className="skeleton-section-content"></div>
                </div>
                <div className="skeleton-section">
                  <div className="skeleton-section-header"></div>
                  <div className="skeleton-section-content"></div>
                </div>
                <div className="skeleton-section">
                  <div className="skeleton-section-header"></div>
                  <div className="skeleton-section-content"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div className="product-loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '1rem 0' }}>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="product-page">
        <div className="product-error">
          <h2>Product Not Found</h2>
          <p>{error || 'The requested product could not be found.'}</p>
        </div>
      </div>
    );
  }

  // Get current color data
  const currentColor = product.colors && product.colors[selectedColor] ? product.colors[selectedColor] : null;
  const productImages = currentColor && currentColor.images ? currentColor.images : [];

  return (
    <div className="product-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">{product.category_name || 'Category'}</Link>
        <span>/</span>
        <Link href="/shop">{product.subcategory_name || 'Subcategory'}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-container">
        {/* Left Column - Image Gallery and Accordion */}
        <div className="product-left">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="thumbnail-images">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image src={`${API_URL.replace('/api', '')}${image}`} alt={`Product view ${index + 1}`} width={80} height={80} style={{ objectFit: 'cover' }} loading="lazy" />
                </div>
              ))}
            </div>
            <div className="main-image-container">
              <div
                className="main-image-wrapper"
                onClick={handleImageClick}
                style={{
                  cursor: 'zoom-in',
                  position: 'relative',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Image
                  src={productImages.length > 0 ? `${API_URL.replace('/api', '')}${productImages[selectedImage]}` : '/src/assets/img/Bestseller1.jpg'}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  loading="lazy"
                />
                <div className="zoom-hint">
                  <span>Click to zoom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="accordion-sections">
            {/* Fitting Section */}
            <div className="accordion-section">
              <div
                className="accordion-header"
                onClick={() => toggleSection('fitting')}
              >
                <span>Fitting</span>
                <span className="accordion-icon">
                  {expandedSections.fitting ? '-' : '+'}
                </span>
              </div>
              {expandedSections.fitting && (
                <div className="accordion-content">
                  <p>{product.fitting_info || 'Fitting information will be displayed here.'}</p>
                </div>
              )}
            </div>

            {/* Fabric & Care Section */}
            <div className="accordion-section">
              <div
                className="accordion-header"
                onClick={() => toggleSection('fabricCare')}
              >
                <span>Fabric & Care</span>
                <span className="accordion-icon">
                  {expandedSections.fabricCare ? '-' : '+'}
                </span>
              </div>
              {expandedSections.fabricCare && (
                <div className="accordion-content">
                  <div className="fabric-info">
                    <h4>Fabric</h4>
                    <p>{product.fabric_info || 'Fabric information will be displayed here.'}</p>
                  </div>
                  <div className="care-info">
                    <h4>Care</h4>
                    <p>{product.care_info || 'Care information will be displayed here.'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Detail Section */}
            <div className="accordion-section">
              <div
                className="accordion-header"
                onClick={() => toggleSection('productDetail')}
              >
                <span>Product Detail</span>
                <span className="accordion-icon">
                  {expandedSections.productDetail ? '-' : '+'}
                </span>
              </div>
              {expandedSections.productDetail && (
                <div className="accordion-content">
                  <p>{product.product_detail || 'Product detail information will be displayed here.'}</p>
                </div>
              )}
            </div>

            {/* Shipping And Return Section */}
            <div className="accordion-section">
              <div
                className="accordion-header"
                onClick={() => toggleSection('shippingReturn')}
              >
                <span>Shipping And Return</span>
                <span className="accordion-icon">
                  {expandedSections.shippingReturn ? '-' : '+'}
                </span>
              </div>
              {expandedSections.shippingReturn && (
                <div className="accordion-content">
                  <div className="shipping-info">
                    <h4>Shipping</h4>
                    <p>{product.shipping_info || 'Shipping information will be displayed here.'}</p>
                  </div>
                  <div className="return-info">
                    <h4>Returns</h4>
                    <p>{product.return_policy || '7 Days Exchange Policy: We offer a 7-day exchange policy for all products. Items must be in original condition with tags attached. Exchange is subject to availability of the desired size/color.'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="product-right">
          {/* Product Title */}
          <h1 className="product-title">{product.name}</h1>

          {/* Product Description */}
          <p className="product-description">
            {product.description || 'Product description will be displayed here.'}
          </p>

          {/* Price Display */}
          <div className="price-section">
            <div className="price-container">
              <div className="price-main-row">
                <div className="price-comparison">
                  <span className="selling-price">₹{getCurrentPrice().toLocaleString()}</span>
                  {getCurrentActualPrice() > 0 && getCurrentActualPrice() > getCurrentPrice() && (
                    <div className="mrp-container">
                      <span className="actual-price">₹{getCurrentActualPrice().toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {getDiscountPercentage() > 0 && (
                  <span className="discount-badge">{getDiscountPercentage()}% OFF</span>
                )}
              </div>
              {getDiscountPercentage() > 0 && (
                <div className="savings-info">
                  You save ₹{(getCurrentActualPrice() - getCurrentPrice()).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="color-section">
              <h3>Colors</h3>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`color-option ${selectedColor === index ? 'selected' : ''}`}
                    onClick={() => handleColorSelect(index)}
                  >
                    <div className="color-image-container" style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                      <Image
                        src={color.images && color.images.length > 0 ? `${API_URL.replace('/api', '')}${color.images[0]}` : '/src/assets/img/Bestseller1.jpg'}
                        alt={color.color_name}
                        className="color-image"
                        fill
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <span className="color-name">{color.color_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-section">
              <div className="size-header">
                <label>Size</label>
                <button className="size-guide" onClick={openSizeChart}>Size Guide</button>
              </div>
              <div className="size-options">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-option ${selectedSize === size.size ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(size.size)}
                  >
                    <span className="size-value">{size.size}</span>
                    <span className="size-price">₹{size.sell_price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart / Go to Cart Button */}
          {(() => {
            const selectedSizeData = product.sizes.find(size => size.size === selectedSize);
            const selectedColorData = product.colors && product.colors[selectedColor];
            const isProductInCart = isInCart(
              product.product_id,
              selectedColorData ? selectedColorData.color_id : null,
              selectedSizeData ? selectedSizeData.size_id : null
            );

            if (isProductInCart) {
              return (
                <button
                  className="go-to-cart-btn"
                  onClick={() => router.push('/cart')}
                >
                  Go to Cart
                </button>
              );
            } else {
              return (
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add To Cart
                </button>
              );
            }
          })()}

          {/* Buy Now Button */}
          <button
            className="buy-now-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

          {/* Additional Links */}
          <div className="additional-links">
            <a href="#" className="easy-return">
              <span className="icon">🚚</span>
              Easy Return
            </a>
            <button
              className={`wishlist-btn ${isInWishlist(product.product_id) ? 'in-wishlist' : ''}`}
              onClick={isInWishlist(product.product_id) ? handleRemoveFromWishlist : handleAddToWishlist}
            >
              <span className="icon">❤️</span>
              {isInWishlist(product.product_id) ? 'Remove from Wishlist' : 'Add To Wishlist'}
            </button>
          </div>

          {/* Material Details */}
          <div className="material-section">
            <h3>Product Information</h3>
            <p>
              {product.fabric_info || 'This material is our signature high-quality fabric that provides comfort and style.'}
            </p>
            <div className="feature-tags">
              <span className="feature-tag">Premium Quality</span>
              <span className="feature-tag">Comfortable</span>
              <span className="feature-tag">Stylish</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Sections for Mobile */}
      <div className="accordion-sections-mobile">
        {/* Fitting Section */}
        <div className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => toggleSection('fitting')}
          >
            <span>Fitting</span>
            <span className="accordion-icon">
              {expandedSections.fitting ? '-' : '+'}
            </span>
          </div>
          {expandedSections.fitting && (
            <div className="accordion-content">
              <p>{product.fitting_info || 'Fitting information will be displayed here.'}</p>
            </div>
          )}
        </div>

        {/* Fabric & Care Section */}
        <div className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => toggleSection('fabricCare')}
          >
            <span>Fabric & Care</span>
            <span className="accordion-icon">
              {expandedSections.fabricCare ? '-' : '+'}
            </span>
          </div>
          {expandedSections.fabricCare && (
            <div className="accordion-content">
              <div className="fabric-info">
                <h4>Fabric</h4>
                <p>{product.fabric_info || 'Fabric information will be displayed here.'}</p>
              </div>
              <div className="care-info">
                <h4>Care</h4>
                <p>{product.care_info || 'Care information will be displayed here.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Detail Section */}
        <div className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => toggleSection('productDetail')}
          >
            <span>Product Detail</span>
            <span className="accordion-icon">
              {expandedSections.productDetail ? '-' : '+'}
            </span>
          </div>
          {expandedSections.productDetail && (
            <div className="accordion-content">
              <p>{product.product_detail || 'Product detail information will be displayed here.'}</p>
            </div>
          )}
        </div>

        {/* Shipping And Return Section */}
        <div className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => toggleSection('shippingReturn')}
          >
            <span>Shipping And Return</span>
            <span className="accordion-icon">
              {expandedSections.shippingReturn ? '-' : '+'}
            </span>
          </div>
          {expandedSections.shippingReturn && (
            <div className="accordion-content">
              <div className="shipping-info">
                <h4>Shipping</h4>
                <p>{product.shipping_info || 'Shipping information will be displayed here.'}</p>
              </div>
              <div className="return-info">
                <h4>Returns</h4>
                <p>{product.return_policy || '7 Days Exchange Policy: We offer a 7-day exchange policy for all products. Items must be in original condition with tags attached. Exchange is subject to availability of the desired size/color.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Reviews Section */}
      <ProductReview productId={productId} productName={product.name} />

      {/* You May Also Like Section */}
      <AlsoLike productId={productId} />

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="size-chart-modal-overlay" onClick={closeSizeChart}>
          <div style={{ position: 'relative', width: '90vw', maxWidth: '800px', height: '90vh', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <Image
              src="/src/assets/img/size chart.jpg"
              alt="Size Chart"
              className="size-chart-image"
              fill
              style={{ objectFit: 'contain', borderRadius: '12px' }}
              onError={(e) => {
                e.target.src = '/src/assets/img/Bestseller1.jpg';
              }}
            />
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="zoom-modal-overlay" onClick={closeZoomModal}>
          <div className="zoom-modal-content">
            <button className="zoom-close-btn" onClick={closeZoomModal}>×</button>
            <div className="zoom-modal-image-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
              <Image
                src={productImages.length > 0 ? `${API_URL.replace('/api', '')}${productImages[selectedImage]}` : '/src/assets/img/Bestseller1.jpg'}
                alt={product.name}
                className="zoom-modal-image"
                fill
                style={{
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  transform: `scale(${zoomModalScale}) translate(${zoomModalPosition.x}px, ${zoomModalPosition.y}px)`,
                  transformOrigin: 'center',
                  transition: isZoomModalDragging ? 'none' : 'transform 0.3s ease',
                  cursor: zoomModalScale > 1 ? (isZoomModalDragging ? 'grabbing' : 'grab') : 'zoom-in'
                }}
              />
              <div className="zoom-modal-hint">
                {zoomModalScale === 1 ? 'Tap to zoom in' : 'Tap to zoom out • Drag to pan'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
