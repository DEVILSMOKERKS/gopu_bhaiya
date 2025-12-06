'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import './checkoutinfo.css';
import { IoMdSearch } from "react-icons/io";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Checkoutinfo = () => {
  const router = useRouter();
  const { cart } = useWishlistCart();
  const [formData, setFormData] = useState({
    email: '',
    newsOffers: false,
    country: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    postalCode: '',
    city: '',
    phone: '',
    saveInfo: false
  });

  // Cart data states
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Coupon states
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'cod' or 'online'

  // Order processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Load cart data from cart context and sessionStorage
  useEffect(() => {
    // First, try to get data from sessionStorage (from cart page)
    if (typeof window === 'undefined') return;

    const checkoutData = sessionStorage.getItem('checkoutData');
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData);
        setCartItems(data.cartItems || []);
        setSubtotal(data.subtotal || 0);
        setAppliedCoupon(data.appliedCoupon || null);
        setPaymentMethod(data.paymentMethod || 'online');
        return;
      } catch (err) {
        console.error('Error parsing checkout data:', err);
      }
    }

    // If no sessionStorage data, use cart context
    if (cart && cart.items && cart.items.length > 0) {
      const transformedItems = cart.items.map(item => ({
        id: item.cart_id || item.product_id,
        product_id: item.product_id,
        color_id: item.color_id,
        size_id: item.size_id,
        name: item.product?.name || 'Product',
        size: item.size_name || item.size || 'Standard',
        color: item.color_name || item.color || 'Default',
        price: item.sell_price || item.product?.price || 0,
        quantity: item.quantity || 1,
        image: item.product?.image || '/src/assets/img/Bestseller1.jpg'
      }));

      setCartItems(transformedItems);
      const calculatedSubtotal = transformedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setSubtotal(calculatedSubtotal);

      // Store in sessionStorage for consistency
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('checkoutData', JSON.stringify({
          cartItems: transformedItems,
          subtotal: calculatedSubtotal,
          appliedCoupon: null,
          paymentMethod: 'online'
        }));
      } else {
        // No cart data available, redirect to cart
        router.push('/cart');
      }
    }
  }, [cart, router]);

  // Fetch available coupons on component mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  // Refresh cart data when cart context changes
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      const transformedItems = cart.items.map(item => ({
        id: item.cart_id || item.product_id,
        product_id: item.product_id,
        color_id: item.color_id,
        size_id: item.size_id,
        name: item.product?.name || 'Product',
        size: item.size_name || item.size || 'Standard',
        color: item.color_name || item.color || 'Default',
        price: item.sell_price || item.product?.price || 0,
        quantity: item.quantity || 1,
        image: item.product?.image || '/src/assets/img/Bestseller1.jpg'
      }));

      // Only update if the data has actually changed
      if (JSON.stringify(transformedItems) !== JSON.stringify(cartItems)) {
        setCartItems(transformedItems);
        const calculatedSubtotal = transformedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSubtotal(calculatedSubtotal);
      }
    }
  }, [cart, cartItems]);

  // Auto-fill form data if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    if (user) {

      setFormData(prevData => ({
        ...prevData,
        email: user.email || '',
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || '',
        country: user.country || ''
      }));
    }
  }, []);

  const fetchAvailableCoupons = async () => {
    // Set default client-side coupons
    const defaultCoupons = [
      {
        coupon_id: 'aj10',
        code: 'AJ10',
        name: 'AJ10 Discount',
        description: '10% off on your order',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 0,
        max_discount: 200,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        status: 'active'
      },
      {
        coupon_id: 'welcome10',
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off on your first order',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 500,
        max_discount: 200,
        usage_limit: 100,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2024-12-31',
        status: 'active'
      },
      {
        coupon_id: 'save20',
        code: 'SAVE20',
        name: 'Save 20%',
        description: '20% off on your order',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_amount: 1000,
        max_discount: 500,
        usage_limit: 50,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        status: 'active'
      },
      {
        coupon_id: 'flat100',
        code: 'FLAT100',
        name: 'Flat ₹100 Off',
        description: 'Get ₹100 off on your order',
        discount_type: 'fixed',
        discount_value: 100,
        min_order_amount: 500,
        max_discount: 100,
        usage_limit: 200,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        status: 'active'
      }
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.country) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      'AJ10': {
        coupon_id: 'aj10',
        code: 'AJ10',
        name: 'AJ10 Discount',
        description: '10% off on your order',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 0,
        max_discount: 200,
        usage_limit: 1000,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        status: 'active'
      },
      'WELCOME10': {
        coupon_id: 'welcome10',
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off on your first order',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 500,
        max_discount: 200,
        usage_limit: 100,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2024-12-31',
        status: 'active'
      },
      'SAVE20': {
        coupon_id: 'save20',
        code: 'SAVE20',
        name: 'Save 20%',
        description: '20% off on your order',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_amount: 1000,
        max_discount: 500,
        usage_limit: 50,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        status: 'active'
      },
      'FLAT100': {
        coupon_id: 'flat100',
        code: 'FLAT100',
        name: 'Flat ₹100 Off',
        description: 'Get ₹100 off on your order',
        discount_type: 'fixed',
        discount_value: 100,
        min_order_amount: 500,
        max_discount: 100,
        usage_limit: 200,
        used_count: 0,
        valid_from: '2024-01-01',
        valid_to: '2025-12-31',
        status: 'active'
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

      // Update sessionStorage with coupon
      const checkoutData = typeof window !== 'undefined' ? sessionStorage.getItem('checkoutData') : null;
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        data.appliedCoupon = coupon;
        sessionStorage.setItem('checkoutData', JSON.stringify(data));
      }

      setCouponLoading(false);
      return;
    }

    // If not a client-side coupon, try API validation
    try {
      const response = await axios.get(`${API_URL}/coupons/validate/${couponCode}`);

      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        setCouponError('');

        // Update sessionStorage with new coupon
        if (typeof window !== 'undefined') {
          const checkoutData = sessionStorage.getItem('checkoutData');
          if (checkoutData) {
            const data = JSON.parse(checkoutData);
            data.appliedCoupon = response.data.data;
            sessionStorage.setItem('checkoutData', JSON.stringify(data));
          }
        }
      } else {
        setCouponError(response.data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Coupon application error:', error);

      // If API fails, show error but don't apply fallback
      if (error.response?.data?.message) {
        setCouponError(error.response.data.message);
      } else if (error.response?.status === 404) {
        setCouponError('Coupon code not found');
      } else if (error.response?.status === 400) {
        setCouponError('Invalid coupon code');
      } else if (error.response?.status === 410) {
        setCouponError('Coupon has expired');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setCouponError('Network error. Please check your connection and try again.');
      } else {
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

    // Update sessionStorage to remove coupon
    if (typeof window !== 'undefined') {
      const checkoutData = sessionStorage.getItem('checkoutData');
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        data.appliedCoupon = null;
        sessionStorage.setItem('checkoutData', JSON.stringify(data));
      }
    }
  };

  // Handle navigation back to cart
  const handleReturnToCart = () => {
    router.push('/cart');
  };


  // Handle order creation
  const handleCreateOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      let token = localStorage.getItem('token');
      let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      // User creation is now handled in backend during order creation

      // Map cart items to the structure expected by backend
      const validItems = cartItems.map(item => ({
        product_id: item.product_id || item.id, // Use product_id if available, fallback to id
        color_id: item.color_id || 1, // Default to 1 if not available
        size_id: item.size_id || 1, // Default to 1 if not available
        quantity: item.quantity
      }));


      // Prepare order data
      const orderData = {
        user_id: user ? user.id : null, // null for guest checkout
        items: validItems,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email // Add email for guest checkout
        },
        billing_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email // Add email for guest checkout
        },
        payment_method: paymentMethod, // This was missing - now added
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        amount: total
      };


      if (paymentMethod === 'cod') {

        // Create COD order directly in database
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const codResponse = await axios.post(`${API_URL}/orders/create-cod`, orderData, { headers });

        if (codResponse.data.success) {
          // Auto-login if user was created
          if (codResponse.data.data.user && codResponse.data.data.token) {
            localStorage.setItem('token', codResponse.data.data.token);
            localStorage.setItem('user', JSON.stringify(codResponse.data.data.user));
          }

          // Track Purchase event for Facebook Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            try {
              const contentIds = cartItems.map(item => item.product_id.toString());
              const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

              window.fbq('track', 'Purchase', {
                content_ids: contentIds,
                content_type: 'product',
                value: totalValue,
                currency: 'INR',
                num_items: cartItems.length
              });
            } catch (error) {
              console.error('Error tracking Purchase:', error);
            }
          }

          // Store order data in sessionStorage for thankyou page
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('orderData', JSON.stringify({
              orderNumber: codResponse.data.data.order_number,
              orderId: codResponse.data.data.order_id
            }));
            sessionStorage.removeItem('checkoutData');
          }
          // Navigate to success page
          router.push('/thankyou');
        }
      } else {
        // For online payment, create Razorpay order first
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const createResponse = await axios.post(`${API_URL}/orders/create`, orderData, { headers });

        if (createResponse.data.success) {
          const { razorpay_order_id, order_number } = createResponse.data.data;

          // Store order data for online payment
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pendingOrder', JSON.stringify({
              razorpayOrderId: razorpay_order_id,
              orderNumber: order_number,
              amount: total,
              currency: 'INR',
              customerName: `${formData.firstName} ${formData.lastName}`,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              shippingAddress: formData,
              cartItems: cartItems
            }));
          }

          // Navigate to payment page
          router.push('/checkout/payment');
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.message || 'Error creating order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate COD fee
  const codFee = paymentMethod === 'cod' ? 100 : 0;

  // Calculate discount if coupon is applied
  const discount = appliedCoupon ?
    (appliedCoupon.discount_type === 'percentage' ?
      (subtotal * appliedCoupon.discount_value / 100) :
      appliedCoupon.discount_value) : 0;
  const total = subtotal + codFee - discount;


  return (
    <div className="checkoutinfo-container">
      <div className="checkoutinfo-left">
        {/* Header */}
        <div className="checkoutinfo-header">
          <div className="checkoutinfo-logo">Mateshwari Moorti Bhandar</div>
          <div className="checkoutinfo-progress">
            <span>Cart</span>
            <span>/</span>
            <span>Info</span>
            <span>/</span>
            <span className="checkoutinfo-active">Shipping</span>
            <span>/</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="checkoutinfo-section">
          <div className="checkoutinfo-section-header">
            <h2>Contact</h2>
            <a href="#" className="checkoutinfo-login-link">Have An Account? Log In</a>
          </div>
          <div className="checkoutinfo-input-group">
            <div className="checkoutinfo-input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`checkoutinfo-input ${formErrors.email ? 'error' : ''}`}
              />
              <span className="checkoutinfo-input-icon">✉</span>
            </div>
            {formErrors.email && <span className="checkoutinfo-error-message">{formErrors.email}</span>}
            <label className="checkoutinfo-checkbox">
              <input
                type="checkbox"
                name="newsOffers"
                checked={formData.newsOffers}
                onChange={handleInputChange}
              />
              <span>Email Me With News And Offers</span>
            </label>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="checkoutinfo-section">
          <h2>Shipping Address</h2>
          <div className="checkoutinfo-form">
            <div className="checkoutinfo-input-wrapper">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country/Region"
                className={`checkoutinfo-input ${formErrors.country ? 'error' : ''}`}
              />
              <span className="checkoutinfo-input-icon">✕</span>
            </div>
            {formErrors.country && <span className="checkoutinfo-error-message">{formErrors.country}</span>}

            <div className="checkoutinfo-row">
              <div className="checkoutinfo-input-wrapper">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className={`checkoutinfo-input ${formErrors.firstName ? 'error' : ''}`}
                />
              </div>
              <div className="checkoutinfo-input-wrapper">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className={`checkoutinfo-input ${formErrors.lastName ? 'error' : ''}`}
                />
              </div>
            </div>
            {(formErrors.firstName || formErrors.lastName) && (
              <span className="checkoutinfo-error-message">{formErrors.firstName || formErrors.lastName}</span>
            )}

            <div className="checkoutinfo-input-wrapper">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company (Optional)"
                className="checkoutinfo-input"
              />
            </div>

            <div className="checkoutinfo-input-wrapper">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className={`checkoutinfo-input ${formErrors.address ? 'error' : ''}`}
              />
              <span className="checkoutinfo-input-icon"><IoMdSearch size={25} /></span>
            </div>
            {formErrors.address && <span className="checkoutinfo-error-message">{formErrors.address}</span>}

            <div className="checkoutinfo-input-wrapper">
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Apartment, Suite, Etc. (Optional)"
                className="checkoutinfo-input"
              />
            </div>

            <div className="checkoutinfo-row">
              <div className="checkoutinfo-input-wrapper">
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className={`checkoutinfo-input ${formErrors.postalCode ? 'error' : ''}`}
                />
              </div>
              <div className="checkoutinfo-input-wrapper">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={`checkoutinfo-input ${formErrors.city ? 'error' : ''}`}
                />
              </div>
            </div>
            {(formErrors.postalCode || formErrors.city) && (
              <span className="checkoutinfo-error-message">{formErrors.postalCode || formErrors.city}</span>
            )}

            <div className="checkoutinfo-input-wrapper">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className={`checkoutinfo-input ${formErrors.phone ? 'error' : ''}`}
              />
              <span className="checkoutinfo-input-icon"><HiOutlineDevicePhoneMobile size={25} /></span>
            </div>
            {formErrors.phone && <span className="checkoutinfo-error-message">{formErrors.phone}</span>}

            <label className="checkoutinfo-checkbox">
              <input
                type="checkbox"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
              />
              <span>Save This Information For Next Time</span>
            </label>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="checkoutinfo-navigation">
          <button className="checkoutinfo-back-link" onClick={handleReturnToCart}>
            <span>←</span> Return To Cart
          </button>

          {/* Payment Method Selection */}
          <div className="checkoutinfo-payment-methods">
            <h3>Select Payment Method</h3>
            <div className="checkoutinfo-payment-options">
              <label className={`checkoutinfo-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="checkoutinfo-payment-content">
                  <span className="checkoutinfo-payment-icon">💳</span>
                  <div className="checkoutinfo-payment-details">
                    <span className="checkoutinfo-payment-title">Cash on Delivery</span>
                    <span className="checkoutinfo-payment-desc">Pay when you receive + ₹100 fee</span>
                  </div>
                </div>
              </label>

              <label className={`checkoutinfo-payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="checkoutinfo-payment-content">
                  <span className="checkoutinfo-payment-icon">💳</span>
                  <div className="checkoutinfo-payment-details">
                    <span className="checkoutinfo-payment-title">Online Payment</span>
                    <span className="checkoutinfo-payment-desc">Pay securely online</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            className="checkoutinfo-continue-btn"
            onClick={handleCreateOrder}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : 'Process To Payment')}
          </button>
        </div>
      </div>

      {/* Right Section - Cart Summary */}
      <div className="checkoutinfo-right">
        <div className="checkoutinfo-cart">
          <h2>Your Cart</h2>

          <div className="checkoutinfo-cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={item.id || item.product_id || index} className="checkoutinfo-cart-item">
                  <div className="checkoutinfo-item-image">
                    <Image
                      src={item.image || '/src/assets/img/Bestseller1.jpg'}
                      alt={item.name || 'Product'}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/src/assets/img/Bestseller1.jpg';
                      }}
                    />
                  </div>
                  <div className="checkoutinfo-item-details">
                    <h3>{item.name || 'Product'}</h3>
                    <p>Size: {item.size || 'Standard'}, Color: {item.color || 'Default'}</p>
                    <div className="checkoutinfo-quantity">
                      <span>Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                  <div className="checkoutinfo-item-price">
                    <span>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="checkoutinfo-empty-cart">
                <p>No items in cart</p>
                <button onClick={() => router.push('/cart')} className="checkoutinfo-back-to-cart">
                  Go to Cart
                </button>
              </div>
            )}
          </div>

          {/* Coupon Section */}
          <div className="checkoutinfo-coupon-section">
            <h3>Available Coupons</h3>
            <p className="checkoutinfo-coupon-subtitle">Click on any coupon to apply it automatically</p>

            {/* Available Coupons Display */}
            <div className="checkoutinfo-available-coupons">
              {availableCoupons.map((coupon) => (
                <div
                  key={coupon.coupon_id}
                  className="checkoutinfo-coupon-card"
                  onClick={() => {
                    setCouponCode(coupon.code);
                    handleApplyCoupon();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="checkoutinfo-coupon-header">
                    <div className="checkoutinfo-coupon-code">{coupon.code}</div>
                    <div className="checkoutinfo-coupon-discount">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                    </div>
                  </div>
                  <div className="checkoutinfo-coupon-details">
                    <div className="checkoutinfo-coupon-name">{coupon.name}</div>
                    <div className="checkoutinfo-coupon-description">{coupon.description}</div>
                    {coupon.min_order_amount > 0 && (
                      <div className="checkoutinfo-coupon-min-order">
                        Min. order: ₹{coupon.min_order_amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="checkoutinfo-coupon-input">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code"
                className="checkoutinfo-coupon-field"
              />
              <button
                className="checkoutinfo-apply-btn"
                onClick={handleApplyCoupon}
                disabled={couponLoading}
              >
                {couponLoading ? 'Applying...' : 'Apply'}
              </button>
            </div>

            {/* Applied Coupon */}
            {appliedCoupon && (
              <div className="checkoutinfo-applied-coupon">
                <div className="checkoutinfo-applied-coupon-info">
                  <span className="checkoutinfo-applied-code">{appliedCoupon.code}</span>
                  <span className="checkoutinfo-applied-discount">-₹{discount.toFixed(2)}</span>
                </div>
                <button
                  className="checkoutinfo-remove-coupon"
                  onClick={handleRemoveCoupon}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Coupon Error */}
            {couponError && (
              <div className="checkoutinfo-coupon-error">
                {couponError}
              </div>
            )}
          </div>

          <div className="checkoutinfo-order-summary">
            <div className="checkoutinfo-summary-row">
              <span>Subtotal ({cartItems.length})</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="checkoutinfo-summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            {paymentMethod === 'cod' && (
              <div className="checkoutinfo-summary-row checkoutinfo-cod-fee">
                <span>COD Fee</span>
                <span>₹{codFee.toFixed(2)}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="checkoutinfo-summary-row checkoutinfo-discount">
                <span>Discount ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `₹${appliedCoupon.discount_value}`})</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="checkoutinfo-summary-row checkoutinfo-total">
              <span>Total Orders:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="checkoutinfo-disclaimer">
            We guarantee no additional charges on delivery.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkoutinfo;