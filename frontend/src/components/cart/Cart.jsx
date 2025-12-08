'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import './cart.css';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading, error } = useWishlistCart();
  const router = useRouter();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Coupon states
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Fetch available coupons on component mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    // Set default client-side coupons
    const defaultCoupons = [
      // {
      //   coupon_id: 'aj10',
      //   code: 'AJ10',
      //   name: 'AJ10 Discount',
      //   description: '10% off on your order',
      //   discount_type: 'percentage',
      //   discount_value: 10,
      //   min_order_amount: 0,
      //   max_discount: 200,
      //   usage_limit: 1000,
      //   used_count: 0,
      //   valid_from: '2024-01-01',
      //   valid_to: '2025-12-31',
      //   is_active: true
      // },
      {
        coupon_id: 'welcome10',
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off for new customers',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 500,
        max_discount: 500,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        is_active: true
      },
      {
        coupon_id: 'save20',
        code: 'SAVE20',
        name: 'Save More',
        description: '20% off on orders above ₹1000',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_amount: 1000,
        max_discount: 1000,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        is_active: true
      }
      // {
      //   coupon_id: 'flat100',
      //   code: 'FLAT100',
      //   name: 'Flat Discount',
      //   description: '₹100 off on orders above ₹500',
      //   discount_type: 'fixed',
      //   discount_value: 100,
      //   min_order_amount: 500,
      //   max_discount: 100,
      //   usage_limit: 1000,
      //   used_count: 0,
      //   valid_from: '2024-01-01',
      //   valid_to: '2025-12-31',
      //   is_active: true
      // }
    ];

    setAvailableCoupons(defaultCoupons);

    // Try to fetch additional coupons from API
    try {
      const response = await axios.get(`${API_URL}/coupons/active`);
      if (response.data.success && response.data.data.length > 0) {
        // Merge API coupons with default coupons
        const apiCoupons = response.data.data;
        const mergedCoupons = [...defaultCoupons, ...apiCoupons];
        setAvailableCoupons(mergedCoupons);
      }
    } catch (error) {
      console.error('Error fetching coupons from API:', error);
      // Keep using default coupons if API fails
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    // First, try client-side validation for common coupons
    const clientSideCoupons = {
      // 'AJ10': {
      //   coupon_id: 'aj10',
      //   code: 'AJ10',
      //   name: 'AJ10 Discount',
      //   description: '10% off on your order',
      //   discount_type: 'percentage',
      //   discount_value: 10,
      //   min_order_amount: 0,
      //   max_discount: 200,
      //   usage_limit: 1000,
      //   used_count: 0,
      //   valid_from: '2024-01-01',
      //   valid_to: '2025-12-31',
      //   is_active: true
      // },
      'WELCOME10': {
        coupon_id: 'welcome10',
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off for new customers',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 500,
        max_discount: 500,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        is_active: true
      },
      'SAVE20': {
        coupon_id: 'save20',
        code: 'SAVE20',
        name: 'Save More',
        description: '20% off on orders above ₹1000',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_amount: 1000,
        max_discount: 1000,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        is_active: true
      },
      'SHANKAR60': {
        coupon_id: 'flat100',
        code: 'FLAT100',
        name: 'Flat Discount',
        description: '₹100 off on orders above ₹500',
        discount_type: 'percentage',
        discount_value: 100,
        min_order_amount: 500,
        max_discount: 500,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        is_active: true
      }
    };

    const upperCaseCode = couponCode.toUpperCase();

    // Check if it's a valid client-side coupon
    if (clientSideCoupons[upperCaseCode]) {
      const coupon = clientSideCoupons[upperCaseCode];

      // Check minimum order amount
      if (subtotal < coupon.min_order_amount) {
        setCouponError(`Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`);
        setAppliedCoupon(null);
        setCouponLoading(false);
        return;
      }

      // Apply the coupon
      setAppliedCoupon(coupon);
      setCouponError('');

      setCouponLoading(false);
      return;
    }

    // If not a client-side coupon, try API validation
    try {
      const response = await axios.post(`${API_URL}/coupons/validate`, {
        coupon_code: couponCode,
        subtotal: subtotal
      });


      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        setCouponError('');
      } else {
        setCouponError(response.data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);

      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Coupon validation failed';
        setCouponError(errorMessage);
      } else if (error.request) {
        // Network error
        setCouponError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setCouponError('Error applying coupon. Please try again.');
      }
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Handle quantity change
  const handleQuantityChange = (cart_id, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(cart_id, newQuantity);
  };

  // Handle remove item
  const handleRemoveItem = (cart_id) => {
    removeFromCart(cart_id);
  };

  // Handle navigation to checkout with cart data
  const handleNextToCheckout = () => {
    // Prepare cart data for checkout
    const checkoutData = {
      cartItems: cart.items.map(item => ({
        id: item.product_id, // Use actual product_id instead of cart_id
        product_id: item.product_id, // Add explicit product_id
        color_id: item.color_id,
        size_id: item.size_id,
        name: item.product?.name || 'Product',
        size: item.size_name || item.size || 'Standard',
        color: item.color_name || item.color || 'Default',
        price: item.sell_price || item.product?.price || 0,
        quantity: item.quantity || 1,
        image: item.product?.image || '/src/assets/img/Bestseller1.jpg'
      })),
      subtotal: cart.summary?.total_price || cart.summary?.subtotal || 0,
      appliedCoupon: appliedCoupon
    };

    // Store checkout data in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    }

    router.push('/checkout');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="cart-loading-spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show empty cart
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <Link href="/" className="cart-back-link">Back</Link>
          <h1 className="cart-title">Your Cart</h1>
          <Link href="/shop" className="cart-continue-shopping">Continue Shopping</Link>
        </div>
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to get started.</p>
          <Link href="/shop" className="cart-shop-now-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.summary?.total_price || cart.summary?.subtotal || 0;

  // Calculate discount if coupon is applied
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.discount_type === 'percentage') {
      const discountAmount = (subtotal * appliedCoupon.discount_value) / 100;
      // Apply max discount limit if specified
      if (appliedCoupon.max_discount && discountAmount > appliedCoupon.max_discount) {
        return appliedCoupon.max_discount;
      }
      return discountAmount;
    } else if (appliedCoupon.discount_type === 'fixed') {
      return appliedCoupon.discount_value;
    }
    return 0;
  };

  const discount = calculateDiscount();
  const total = Math.round((subtotal - discount));

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <Link href="/" className="cart-back-link">Back</Link>
        <h1 className="cart-title">Your Cart</h1>
        <Link to="/shop" className="cart-continue-shopping">Continue Shopping</Link>
      </div>

      <div className="cart-container">
        {/* Left Section - Cart Items */}
        <div className="cart-items-section">
          <h2 className="cart-order-summary-title">Order Summary</h2>

          <div className="cart-items-table">
            {/* Table Headers */}
            <div className="cart-table-header">
              <div className="cart-header-product">Product</div>
              <div className="cart-header-price">Price</div>
              <div className="cart-header-quantity">Quantity</div>
              <div className="cart-header-total">Total</div>
            </div>

            {/* Cart Items */}
            {cart.items.map((item) => (
              <div key={item.cart_id} className="cart-item-row">
                <div className="cart-item-product">
                  <div className="cart-item-image">
                    <Image src={item.product?.image || '/src/assets/img/Bestseller1.jpg'} alt={item.product?.name || 'Product'} width={100} height={100} style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.product?.name || 'Product'}</h3>
                    <p className="cart-item-size">Size: {item.size_name || item.size || 'Standard'}</p>
                    <p className="cart-item-color">Color: {item.color_name || item.color || 'Default'}</p>
                    <div className="cart-item-price-mobile">₹{(item.sell_price || item.product?.price || 0).toLocaleString()}</div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item.cart_id)}
                  >
                    ✕
                  </button>
                </div>

                <div className="cart-item-price">
                  ₹{(item.sell_price || item.product?.price || 0).toLocaleString()}
                </div>

                <div className="cart-item-quantity">
                  <div className="cart-quantity-selector">
                    <button
                      className="cart-quantity-btn"
                      onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="cart-quantity-value">{item.quantity}</span>
                    <button
                      className="cart-quantity-btn"
                      onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  ₹{((item.sell_price || item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="cart-summary-section">
          <div className="cart-summary-content">

            {/* Coupon Section */}
            <div className="cart-coupon-section">
              <h3>Available Coupons</h3>
              <p className="cart-coupon-subtitle">Click on any coupon to apply it automatically</p>

              {/* Available Coupons Display */}
              <div className="cart-available-coupons">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.coupon_id}
                    className="cart-coupon-card"
                    onClick={() => {
                      setCouponCode(coupon.code);
                      handleApplyCoupon();
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="cart-coupon-header">
                      <div className="cart-coupon-code">{coupon.code}</div>
                      <div className="cart-coupon-discount">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                      </div>
                    </div>
                    <div className="cart-coupon-details">
                      <div className="cart-coupon-name">{coupon.name}</div>
                      <div className="cart-coupon-description">{coupon.description}</div>
                      {coupon.min_order_amount > 0 && (
                        <div className="cart-coupon-min-order">
                          Min. order: ₹{coupon.min_order_amount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <div className="cart-coupon-input">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Coupon Code"
                  className="cart-coupon-field"
                />
                <button
                  className="cart-apply-btn"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>

              {/* Applied Coupon */}
              {appliedCoupon && (
                <div className="cart-applied-coupon">
                  <div className="cart-applied-coupon-info">
                    <span className="cart-applied-code">{appliedCoupon.code}</span>
                    <span className="cart-applied-discount">-₹{discount.toFixed(2)}</span>
                  </div>
                  <button
                    className="cart-remove-coupon"
                    onClick={handleRemoveCoupon}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Coupon Error */}
              {couponError && (
                <div className="cart-coupon-error">
                  {couponError}
                </div>
              )}
            </div>

            <div className="cart-summary-row">
              <span>Subtotal ({cart.summary?.total_items || 0})</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-free-shipping">Free</span>
            </div>

            {appliedCoupon && (
              <div className="cart-summary-row cart-discount">
                <span>Discount ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `₹${appliedCoupon.discount_value}`})</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-summary-total">
              <span>Total Orders:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="cart-summary-disclaimer">
              We guarantee no additional charges on delivery.
            </div>

            <button className="cart-next-btn" onClick={handleNextToCheckout}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
