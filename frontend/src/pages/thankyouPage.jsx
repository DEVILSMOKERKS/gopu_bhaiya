import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Home, User, ShoppingBag, Clock, Truck, Phone, Mail, MapPin, CreditCard, Shield, Gift, Star } from 'lucide-react';

function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isCODOrder, setIsCODOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Check if user is logged in and load order details
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Get order details from location state
    if (location.state) {
      setOrderNumber(location.state.orderNumber || '');
      setOrderId(location.state.orderId || '');
      
      // Check if this is a COD order (no paymentId means COD)
      const isCOD = !location.state.paymentId;
      setIsCODOrder(isCOD);
      
      // Load additional order details for COD orders
      if (isCOD && location.state.orderNumber) {
        loadOrderDetails(location.state.orderNumber);
      }
    }

    // Track Purchase event for Facebook Pixel (for online payments only)
    if (typeof window !== 'undefined' && window.fbq && !isCODOrder) {
      try {
        // Get cart data from sessionStorage for tracking
        const pendingOrder = sessionStorage.getItem('pendingOrder');
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          const contentIds = orderData.cartItems ? orderData.cartItems.map(item => item.product_id.toString()) : [];
          
          window.fbq('track', 'Purchase', {
            content_ids: contentIds,
            content_type: 'product',
            value: orderData.amount || 0,
            currency: 'INR',
            num_items: orderData.cartItems ? orderData.cartItems.length : 0
          });
          console.log('Facebook Pixel Purchase tracked for online payment order:', orderData.orderNumber);
          
          // Clear the pending order data
          sessionStorage.removeItem('pendingOrder');
        }
      } catch (error) {
        console.error('Error tracking Purchase for online payment:', error);
      }
    }
  }, [location.state, isCODOrder]);

  // Load order details for COD orders
  const loadOrderDetails = async (orderNumber) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/details/${orderNumber}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrderDetails(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleOrdersClick = () => {
    if (user) {
      navigate('/orders');
    } else {
      navigate('/login');
    }
  };

  const styles = {
    container: {
      marginTop: '35px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '20px',
      margin: 0,
      backgroundColor: '#f8fafc',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '48px 32px',
      textAlign: 'center',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    // COD Thank You Page Styles
    codCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '40px',
      maxWidth: '800px',
      width: '100%',
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
    },
    successIcon: {
      width: '80px',
      height: '80px',
      color: '#10b981',
      margin: '0 auto 24px auto',
      backgroundColor: '#ecfdf5',
      borderRadius: '50%',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid #d1fae5',
    },
    codTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 16px 0',
      lineHeight: '1.2',
      textAlign: 'center',
    },
    codSubtitle: {
      fontSize: '18px',
      color: '#6b7280',
      lineHeight: '1.6',
      margin: '0 0 32px 0',
      textAlign: 'center',
    },
    // Order Information Card
    orderInfoCard: {
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      padding: '24px',
      margin: '24px 0',
      border: '1px solid #e5e7eb',
    },
    orderInfoHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    orderInfoTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
    },
    orderStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#10b981',
      fontSize: '14px',
      fontWeight: '500',
    },
    orderInfoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    orderInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f3f4f6',
    },
    orderInfoLabel: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
    },
    orderInfoValue: {
      fontSize: '16px',
      color: '#1f2937',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
    },
    // COD Information Card
    codInfoCard: {
      backgroundColor: '#fef3c7',
      borderRadius: '12px',
      padding: '24px',
      margin: '24px 0',
      border: '1px solid #fbbf24',
    },
    codInfoHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    codInfoTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#92400e',
      margin: 0,
    },
    codInfoContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    codInfoText: {
      fontSize: '16px',
      color: '#92400e',
      lineHeight: '1.5',
      margin: 0,
    },
    codFeatures: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    codFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#92400e',
      fontWeight: '500',
    },
    // Next Steps Card
    nextStepsCard: {
      backgroundColor: '#f0f9ff',
      borderRadius: '12px',
      padding: '24px',
      margin: '24px 0',
      border: '1px solid #0ea5e9',
    },
    nextStepsTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0c4a6e',
      margin: '0 0 20px 0',
    },
    nextStepsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    nextStep: {
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    },
    nextStepNumber: {
      width: '32px',
      height: '32px',
      backgroundColor: '#0ea5e9',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      flexShrink: 0,
    },
    nextStepContent: {
      flex: 1,
    },
    nextStepTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0c4a6e',
      margin: '0 0 4px 0',
    },
    nextStepText: {
      fontSize: '14px',
      color: '#0369a1',
      lineHeight: '1.5',
      margin: 0,
    },
    // Contact Card
    contactCard: {
      backgroundColor: '#f3f4f6',
      borderRadius: '12px',
      padding: '24px',
      margin: '24px 0',
    },
    contactTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      margin: '0 0 16px 0',
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      color: '#6b7280',
    },
    // Offers Card
    offersCard: {
      backgroundColor: '#fdf2f8',
      borderRadius: '12px',
      padding: '24px',
      margin: '24px 0',
      border: '1px solid #f472b6',
    },
    offersHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    offersTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#be185d',
      margin: 0,
    },
    offersContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    offer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      color: '#be185d',
    },
    // Existing styles
    checkIcon: {
      width: '64px',
      height: '64px',
      color: '#10b981',
      margin: '0 auto 24px auto',
      backgroundColor: '#ecfdf5',
      borderRadius: '50%',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#10b981',
      margin: '0 0 32px 0',
      lineHeight: '1.2',
    },
    description: {
      fontSize: '16px',
      color: '#374151',
      lineHeight: '1.6',
      margin: '0 0 24px 0',
    },
    receiptText: {
      fontSize: '16px',
      color: '#374151',
      lineHeight: '1.6',
      margin: '0 0 32px 0',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginTop: '32px',
      flexWrap: 'wrap',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },
    primaryButton: {
      backgroundColor: '#8B0000',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    orderInfo: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      margin: '24px 0',
      border: '1px solid #e5e7eb',
    },
    orderText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0 0 8px 0',
    },
    orderValue: {
      fontSize: '16px',
      color: '#374151',
      fontWeight: '600',
      margin: '0',
    },
  };

  // COD Thank You Page
  if (isCODOrder) {
    return (
      <div style={styles.container}>
        <div style={styles.codCard}>
          {/* Success Icon */}
          <div style={styles.successIcon}>
            <Check size={40} strokeWidth={3} />
          </div>

          {/* Main Title */}
          <h1 style={styles.codTitle}>
            Order Placed Successfully!
          </h1>

          {/* Subtitle */}
          <p style={styles.codSubtitle}>
            Thank you for choosing Mateshwari Moorti Bhandar! Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Information Card */}
          <div style={styles.orderInfoCard}>
            <div style={styles.orderInfoHeader}>
              <h3 style={styles.orderInfoTitle}>Order Details</h3>
              <div style={styles.orderStatus}>
                <Clock size={16} />
                <span>Confirmed</span>
              </div>
            </div>
            
            <div style={styles.orderInfoContent}>
              <div style={styles.orderInfoRow}>
                <span style={styles.orderInfoLabel}>Order Number:</span>
                <span style={styles.orderInfoValue}>{orderNumber}</span>
              </div>
              
              {orderDetails && (
                <>
                  <div style={styles.orderInfoRow}>
                    <span style={styles.orderInfoLabel}>Order Date:</span>
                    <span style={styles.orderInfoValue}>
                      {new Date().toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div style={styles.orderInfoRow}>
                    <span style={styles.orderInfoLabel}>Payment Method:</span>
                    <span style={styles.orderInfoValue}>
                      <CreditCard size={16} style={{ marginRight: '8px' }} />
                      Cash on Delivery
                    </span>
                  </div>
                  
                  <div style={styles.orderInfoRow}>
                    <span style={styles.orderInfoLabel}>Total Amount:</span>
                    <span style={styles.orderInfoValue}>
                      ₹{orderDetails.total_amount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* COD Information */}
          <div style={styles.codInfoCard}>
            <div style={styles.codInfoHeader}>
              <Truck size={20} />
              <h3 style={styles.codInfoTitle}>Cash on Delivery</h3>
            </div>
            <div style={styles.codInfoContent}>
              {/* <p style={styles.codInfoText}>
                You will pay <strong>₹{orderDetails?.total_amount?.toLocaleString() || '0'}</strong> when your order is delivered.
              </p> */}
              <div style={styles.codFeatures}>
                <div style={styles.codFeature}>
                  <Shield size={16} />
                  <span>100% Secure</span>
                </div>
                <div style={styles.codFeature}>
                  <Clock size={16} />
                  <span>No Advance Payment</span>
                </div>
                <div style={styles.codFeature}>
                  <Check size={16} />
                  <span>Pay on Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div style={styles.nextStepsCard}>
            <h3 style={styles.nextStepsTitle}>What happens next?</h3>
            <div style={styles.nextStepsList}>
              <div style={styles.nextStep}>
                <div style={styles.nextStepNumber}>1</div>
                <div style={styles.nextStepContent}>
                  <h4 style={styles.nextStepTitle}>Order Processing</h4>
                  <p style={styles.nextStepText}>We'll prepare your order within 24 hours</p>
                </div>
              </div>
              <div style={styles.nextStep}>
                <div style={styles.nextStepNumber}>2</div>
                <div style={styles.nextStepContent}>
                  <h4 style={styles.nextStepTitle}>Shipping</h4>
                  <p style={styles.nextStepText}>Your order will be shipped within 1-2 business days</p>
                </div>
              </div>
              <div style={styles.nextStep}>
                <div style={styles.nextStepNumber}>3</div>
                <div style={styles.nextStepContent}>
                  <h4 style={styles.nextStepTitle}>Delivery</h4>
                  <p style={styles.nextStepText}>You'll receive your order in 3-7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={styles.contactCard}>
            <h3 style={styles.contactTitle}>Need Help?</h3>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <Phone size={16} />
                <span>+91 9876543210</span>
              </div>
              <div style={styles.contactItem}>
                <Mail size={16} />
                <span>saanzjaipurofficial@gmail.com</span>
              </div>
              <div style={styles.contactItem}>
                <MapPin size={16} />
                <span>Available 24/7</span>
              </div>
            </div>
          </div>


          {/* Navigation Buttons */}
          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleHomeClick}
            >
              <Home size={16} />
              Continue Shopping
            </button>

            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleOrdersClick}
            >
              <ShoppingBag size={16} />
              Track Order
            </button>

            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleProfileClick}
            >
              <User size={16} />
              {user ? 'My Account' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Online Payment Thank You Page (existing)
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.checkIcon}>
          <Check size={32} strokeWidth={3} />
        </div>

        <h1 style={styles.title}>
          Payment Successful
        </h1>

        <p style={styles.description}>
          Thank You For Choosing Mateshwari Moorti Bhandar, Your Order Will Be Generated Based On Your Delivery Request.
        </p>

        <p style={styles.receiptText}>
          The Receipt Has Been Sent To Your Email
        </p>

        {/* Order Information */}
        {(orderNumber || orderId) && (
          <div style={styles.orderInfo}>
            {orderNumber && (
              <div>
                <p style={styles.orderText}>Order Number:</p>
                <p style={styles.orderValue}>{orderNumber}</p>
              </div>
            )}
            {orderId && (
              <div>
                <p style={styles.orderText}>Order ID:</p>
                <p style={styles.orderValue}>{orderId}</p>
              </div>
            )}
          </div>
        )}

        {/* User Login Status */}
        {user ? (
          <p style={{ ...styles.description, color: '#10b981', fontWeight: '500' }}>
            Welcome back, {user.name}! You are logged in.
          </p>
        ) : (
          <p style={{ ...styles.description, color: '#6b7280' }}>
            You are not logged in. Login to track your orders.
          </p>
        )}

        {/* Navigation Buttons */}
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleHomeClick}
          >
            <Home size={16} />
            Go to Home
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleProfileClick}
          >
            <User size={16} />
            {user ? 'My Profile' : 'Login'}
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleOrdersClick}
          >
            <ShoppingBag size={16} />
            {user ? 'My Orders' : 'Login to View Orders'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;