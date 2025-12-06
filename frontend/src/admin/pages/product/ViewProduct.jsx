'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FaArrowLeft, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './ViewProduct.css';

const ViewProduct = ({ productId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      const data = response.data;

      if (data.success) {
        setProduct(data.data);
      } else {
        alert('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      if (data.success) {
        alert('Product deleted successfully!');
        router.push('/admin/products');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      alert('Failed to delete product');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`viewproduct-status-badge ${status}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getPriceRange = (product) => {
    if (product.min_price && product.max_price) {
      if (product.min_price === product.max_price) {
        return `₹${product.min_price}`;
      }
      return `₹${product.min_price} - ₹${product.max_price}`;
    }
    return 'N/A';
  };

  const getFirstSizePrices = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      const firstSize = product.sizes[0];
      return {
        actual: firstSize.actual_price,
        selling: firstSize.sell_price,
        offer: firstSize.offer_percent
      };
    }
    return null;
  };

  const getCurrentImages = () => {
    if (product.colors && product.colors.length > 0) {
      const currentColor = product.colors[selectedColor];
      return currentColor.images || [];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="viewproduct-container">
        <div className="viewproduct-loading">
          <div className="viewproduct-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="viewproduct-container">
        <div className="viewproduct-error">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => router.push('/admin/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="viewproduct-container">
      <div className="viewproduct-header">
        <button
          className="viewproduct-back-btn"
          onClick={() => navigate('/admin/products')}
        >
          <FaArrowLeft /> Back to Products
        </button>
        <div className="viewproduct-header-actions">
          <Link
            to={`/admin/products/edit/${product.product_id}`}
            className="viewproduct-edit-btn"
          >
            <FaEdit /> Edit Product
          </Link>
          <button
            className="viewproduct-delete-btn"
            onClick={handleDelete}
          >
            <FaTrash /> Delete Product
          </button>
        </div>
      </div>

      <div className="viewproduct-product-details">
        <div className="viewproduct-product-main">
          <div className="viewproduct-product-images">
            <div className="viewproduct-main-image">
              {getCurrentImages().length > 0 ? (
                <img
                  src={`${API_URL.replace('/api', '')}${getCurrentImages()[selectedImage]}`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className="viewproduct-no-image">
                  <FaEye />
                  <p>No images available</p>
                </div>
              )}
            </div>

            {getCurrentImages().length > 1 && (
              <div className="viewproduct-image-thumbnails">
                {getCurrentImages().map((image, index) => (
                  <button
                    key={index}
                    className={`viewproduct-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={`${API_URL.replace('/api', '')}${image}`}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="viewproduct-product-info">
            <div className="viewproduct-product-header">
              <h1>{product.name}</h1>
              <div className="viewproduct-product-meta">
                {getStatusBadge(product.status)}
                <span className="viewproduct-product-id">ID: {product.product_id}</span>
              </div>
            </div>

            <div className="viewproduct-product-category">
              {product.category_name && (
                <span className="viewproduct-category">
                  {product.category_name}
                  {product.subcategory_name && ` > ${product.subcategory_name}`}
                </span>
              )}
            </div>

            <div className="viewproduct-product-price">
              {getFirstSizePrices(product) ? (
                <div className="viewproduct-price-display">
                  <div className="viewproduct-price-row">
                    <span className="viewproduct-actual-price">₹{getFirstSizePrices(product).actual}</span>
                    <span className="viewproduct-selling-price">₹{getFirstSizePrices(product).selling}</span>
                  </div>
                  {getFirstSizePrices(product).offer > 0 && (
                    <div className="viewproduct-offer-badge">
                      {getFirstSizePrices(product).offer}% OFF
                    </div>
                  )}
                </div>
              ) : (
                <h2>{getPriceRange(product)}</h2>
              )}
            </div>

            {product.description && (
              <div className="viewproduct-product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="viewproduct-product-colors">
                <h3>Available Colors</h3>
                <div className="viewproduct-color-options">
                  {product.colors.map((color, index) => (
                    <div key={index} className="viewproduct-color-item">
                      <button
                        className={`viewproduct-color-circle ${selectedColor === index ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedColor(index);
                          setSelectedImage(0);
                        }}
                        style={{
                          backgroundColor: selectedColor === index ? color.color_code : 'transparent',
                          borderColor: color.color_code
                        }}
                        title={color.color_name}
                      />
                      <span className="viewproduct-color-name">{color.color_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="viewproduct-product-details-grid">
          {/* Sizes & Pricing */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="viewproduct-detail-section">
              <h3>Sizes & Pricing</h3>
              <div className="viewproduct-sizes-grid">
                {product.sizes.map((size, index) => (
                  <div key={index} className="viewproduct-size-card">
                    <div className="viewproduct-size-header">
                      <h4>{size.size}</h4>
                      {size.offer_percent > 0 && (
                        <span className="viewproduct-offer-badge">{size.offer_percent}% OFF</span>
                      )}
                    </div>
                    <div className="viewproduct-size-pricing">
                      <div className="viewproduct-price-row">
                        <span className="viewproduct-label">Actual Price:</span>
                        <span className="viewproduct-actual-price">₹{size.actual_price}</span>
                      </div>
                      <div className="viewproduct-price-row">
                        <span className="viewproduct-label">Selling Price:</span>
                        <span className="viewproduct-selling-price">₹{size.sell_price}</span>
                      </div>
                      <div className="viewproduct-price-row">
                        <span className="viewproduct-label">Stock:</span>
                        <span className={`viewproduct-stock ${size.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {size.stock > 0 ? `${size.stock} units` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offers */}
          {product.offers && product.offers.length > 0 && (
            <div className="viewproduct-detail-section">
              <h3>Special Offers</h3>
              <div className="viewproduct-offers-grid">
                {product.offers.map((offer, index) => (
                  <div key={index} className="viewproduct-offer-card">
                    <div className="viewproduct-offer-header">
                      <h4>{offer.offer_title}</h4>
                      <span className="viewproduct-discount-badge">{offer.discount_percent}% OFF</span>
                    </div>
                    <p className="viewproduct-offer-description">{offer.offer_description}</p>
                    <div className="viewproduct-offer-dates">
                      <span>Valid from: {new Date(offer.valid_from).toLocaleDateString()}</span>
                      <span>Valid to: {new Date(offer.valid_to).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="viewproduct-detail-section">
            <h3>Additional Information</h3>
            <div className="viewproduct-info-grid">
              {product.fitting_info && (
                <div className="viewproduct-info-item">
                  <h4>Fitting Information</h4>
                  <p>{product.fitting_info}</p>
                </div>
              )}

              {product.fabric_info && (
                <div className="viewproduct-info-item">
                  <h4>Fabric Information</h4>
                  <p>{product.fabric_info}</p>
                </div>
              )}

              {product.care_info && (
                <div className="viewproduct-info-item">
                  <h4>Care Instructions</h4>
                  <p>{product.care_info}</p>
                </div>
              )}

              {product.product_detail && (
                <div className="viewproduct-info-item">
                  <h4>Product Details</h4>
                  <p>{product.product_detail}</p>
                </div>
              )}

              {product.shipping_info && (
                <div className="viewproduct-info-item">
                  <h4>Shipping Information</h4>
                  <p>{product.shipping_info}</p>
                </div>
              )}

              {product.return_policy && (
                <div className="viewproduct-info-item">
                  <h4>Return Policy</h4>
                  <p>{product.return_policy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Statistics */}
          <div className="viewproduct-detail-section">
            <h3>Product Statistics</h3>
            <div className="viewproduct-stats-grid">
              <div className="viewproduct-stat-item">
                <span className="viewproduct-stat-label">Total Colors</span>
                <span className="viewproduct-stat-value">{product.colors ? product.colors.length : 0}</span>
              </div>
              <div className="viewproduct-stat-item">
                <span className="viewproduct-stat-label">Total Sizes</span>
                <span className="viewproduct-stat-value">{product.sizes ? product.sizes.length : 0}</span>
              </div>
              <div className="viewproduct-stat-item">
                <span className="viewproduct-stat-label">Total Offers</span>
                <span className="viewproduct-stat-value">{product.offers ? product.offers.length : 0}</span>
              </div>
              <div className="viewproduct-stat-item">
                <span className="viewproduct-stat-label">Total Images</span>
                <span className="viewproduct-stat-value">
                  {product.colors ?
                    product.colors.reduce((total, color) => total + (color.images ? color.images.length : 0), 0) : 0
                  }
                </span>
              </div>
              <div className="viewproduct-stat-item">
                <span className="viewproduct-stat-label">Created</span>
                <span className="viewproduct-stat-value">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="viewproduct-stat-item">
                <span className="viewproduct-stat-label">Last Updated</span>
                <span className="viewproduct-stat-value">
                  {new Date(product.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
