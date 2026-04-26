'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './checkoutpayment.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Checkoutpayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = () => {
    if (typeof window === 'undefined') return;

    try {
      const pendingOrder = sessionStorage.getItem('pendingOrder');
      if (pendingOrder) {
        const data = JSON.parse(pendingOrder);
        setOrderData(data);
      } else {
        // No pending order, redirect to cart
        router.push('/cart');
        return;
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      router.push('/cart');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      // If not loaded, wait a bit and check again
      const checkRazorpay = () => {
        if (window.Razorpay) {
          resolve(true);
        } else {
          setTimeout(checkRazorpay, 100);
        }
      };
      checkRazorpay();
    });
  };

  const handlePayment = async () => {
    if (!orderData) {
      setPaymentError('Order data not found');
      return;
    }

    try {
      setIsLoading(true);
      setPaymentError('');

      // Initialize Razorpay
      const res = await initializeRazorpay();
      if (!res) {
        setPaymentError('Razorpay SDK failed to load');
        return;
      }

      const options = {
        key: 'rzp_live_RMZ53vN2VEkmXq',
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency,
        name: 'Welcome To Mateshwari Moorti Bhanda',
        description: `Order #${orderData.orderNumber}`,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment via webhook (automatic)
            const verifyResponse = await axios.post(`${API_URL}/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              // Clear session storage
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('pendingOrder');
                sessionStorage.removeItem('checkoutData');
              }

              router.push('/paymentsuccessful', {
                state: {
                  orderNumber: orderData.orderNumber,
                  orderId: verifyResponse.data.data.order_id,
                  paymentId: response.razorpay_payment_id
                }
              });
            } else {
              setPaymentError('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentError('Payment verification failed');
          }
        },
        prefill: {
          name: orderData.customerName || 'Customer Name',
          email: orderData.customerEmail || 'customer@example.com',
          contact: orderData.customerPhone || '9999999999'
        },
        theme: {
          color: '#B68126'
        },
        modal: {
          ondismiss: () => {
            setPaymentError('Payment was cancelled');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="checkoutpayment-container">
        <div className="checkoutpayment-loading-spinner">
          <div className="checkoutpayment-spinner"></div>
          <p>Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="checkoutpayment-container">
        <div className="checkoutpayment-error-message">
          <p>No order data found. Please try again.</p>
          <button onClick={() => router.push('/cart')}>Go to Cart</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkoutpayment-container">
      <div className="checkoutpayment-left">
        {/* Header */}
        <div className="checkoutpayment-header">
          <div className="checkoutpayment-logo">
            <div className="checkoutpayment-logo-main">Welcome To Mateshwari Moorti Bhanda</div>
            <div className="checkoutpayment-logo-sub">BY Welcome To Mateshwari Moorti Bhanda</div>
          </div>
          <div className="checkoutpayment-progress">
            <span className="checkoutpayment-active">Cart</span>
            <span>/</span>
            <span className="checkoutpayment-active">Info</span>
            <span>/</span>
            <span className="checkoutpayment-active">Shipping</span>
            <span>/</span>
            <span className="checkoutpayment-active">Payment</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="checkoutpayment-section">
          <h2>Payment Method</h2>
          <div className="checkoutpayment-payment-info">
            <div className="checkoutpayment-payment-method">
              <div className="checkoutpayment-payment-icon">💳</div>
              <div className="checkoutpayment-payment-details">
                <h3>Secure Online Payment</h3>
                <p>Pay securely using Razorpay</p>
                <div className="checkoutpayment-payment-features">
                  <span>✓ Secure Payment</span>
                  <span>✓ Multiple Payment Options</span>
                  <span>✓ Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkoutpayment-section">
          <h2>Order Summary</h2>
          <div className="checkoutpayment-order-details">
            <div className="checkoutpayment-order-row">
              <span>Order Number:</span>
              <span>{orderData.orderNumber}</span>
            </div>
            <div className="checkoutpayment-order-row">
              <span>Amount:</span>
              <span>₹{orderData.amount.toLocaleString()}</span>
            </div>
            <div className="checkoutpayment-order-row">
              <span>Currency:</span>
              <span>{orderData.currency}</span>
            </div>

            {/* Customer Details */}
            {orderData.customerName && (
              <div className="checkoutpayment-order-row">
                <span>Customer:</span>
                <span>{orderData.customerName}</span>
              </div>
            )}
            {orderData.customerEmail && (
              <div className="checkoutpayment-order-row">
                <span>Email:</span>
                <span>{orderData.customerEmail}</span>
              </div>
            )}
            {orderData.customerPhone && (
              <div className="checkoutpayment-order-row">
                <span>Phone:</span>
                <span>{orderData.customerPhone}</span>
              </div>
            )}

            {/* Cart Items */}
            {orderData.cartItems && orderData.cartItems.length > 0 && (
              <div className="checkoutpayment-cart-items">
                <h3>Items in Cart:</h3>
                {orderData.cartItems.map((item, index) => (
                  <div key={index} className="checkoutpayment-cart-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="checkoutpayment-error">
            <p>{paymentError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="checkoutpayment-navigation">
          <button className="checkoutpayment-back-link" onClick={handleBackToCheckout}>
            ← Back to Checkout
          </button>
          <button
            className="checkoutpayment-pay-btn"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Pay ₹${orderData.amount.toLocaleString()}`}
          </button>
        </div>
      </div>

      {/* Right Section - Payment Security */}
      <div className="checkoutpayment-right">
        <div className="checkoutpayment-security">
          <h2>Payment Security</h2>

          <div className="checkoutpayment-security-features">
            <div className="checkoutpayment-security-item">
              <div className="checkoutpayment-security-icon">🔒</div>
              <div className="checkoutpayment-security-content">
                <h3>SSL Secured</h3>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>

            <div className="checkoutpayment-security-item">
              <div className="checkoutpayment-security-icon">🛡️</div>
              <div className="checkoutpayment-security-content">
                <h3>PCI Compliant</h3>
                <p>We follow industry security standards</p>
              </div>
            </div>

            <div className="checkoutpayment-security-item">
              <div className="checkoutpayment-security-icon">✅</div>
              <div className="checkoutpayment-security-content">
                <h3>Verified by Razorpay</h3>
                <p>Trusted payment gateway with millions of users</p>
              </div>
            </div>
          </div>

          <div className="checkoutpayment-payment-methods">
            <h3>Accepted Payment Methods</h3>
            <div className="checkoutpayment-methods-grid">
              <div className="checkoutpayment-method-item">Credit Cards</div>
              <div className="checkoutpayment-method-item">Debit Cards</div>
              <div className="checkoutpayment-method-item">Net Banking</div>
              <div className="checkoutpayment-method-item">UPI</div>
              <div className="checkoutpayment-method-item">Wallets</div>
              <div className="checkoutpayment-method-item">EMI</div>
            </div>
          </div>

          <div className="checkoutpayment-disclaimer">
            <p>By proceeding with the payment, you agree to our Terms of Service and Privacy Policy.</p>
            <p>Your payment will be processed securely by Razorpay.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkoutpayment;
