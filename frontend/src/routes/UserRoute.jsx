import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Home from '../pages/Home'
import Product from '../pages/product/Product'
import Login from '../components/login/login/Login'
import Signup from '../components/login/signup/Signup'
import ForgotPassword from '../components/login/forgot-password/ForgotPassword'
import ResetPassword from '../components/login/reset-password/ResetPassword'
import Wishlist from '../components/wishlist/Wishlist'
import Shop from '../pages/shop/Shop'
import Checkoutinfo from '../components/Checkout/Checkoutinfo'
import Checkoutpayment from '../components/Checkoutpayment/Checkoutpayment'
import ThankYouPage from '../pages/thankyouPage'
import Paymentsuccessful from '../components/Paymentsuccessful/Paymentsuccessful'
import Contactus from '../components/contactUs/Contactus'
import AboutSection from '../components/AboutUs/About'
import Profile from '../components/profile/Profile'
import ProtectedRoute from './ProtectedRoute'
import Return from '../components/return/Return'
import Terms from '../components/terms/Terms'
import Privacy from '../components/Privacy/Privacy'
import ShippingPolicy from '../components/shippingpolicy/ShippingPolicy'
import Cart from '../components/cart/Cart'
import ComingSoon from '../pages/ComingSoon'

// Order Management Components
import Orders from '../pages/Orders'
import OrderDetails from '../pages/OrderDetails'
import OrderTracking from '../pages/OrderTracking'

// Blog Components
import Blogs from '../pages/Blogs'
import BlogDetail from '../pages/BlogDetail'


const UserRoute = ({
  onAccountClick,
  loading,
  isSignupOpen,
  setIsSignupOpen
}) => {
  const location = useLocation();
  const isComingSoon = false; // ComingSoon page is no longer the main route

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {!isComingSoon && <Header onAccountClick={onAccountClick} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutSection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkoutinfo />} />
        <Route path="/checkout/payment" element={<Checkoutpayment />} />
        <Route path='/thankyou' element={<ThankYouPage />} />
        <Route path='/paymentsuccessful' element={<Paymentsuccessful />} />
        <Route path='/contact-us' element={<Contactus />} />
        <Route path='/return-and-refund' element={<Return />} />
        <Route path='/terms-and-conditions' element={<Terms />} />
        <Route path='/privacy-policy' element={<Privacy />} />
        <Route path='/shipping-policy' element={<ShippingPolicy />} />

        {/* Order Management Routes */}
        <Route path='/orders' element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path='/orders/:orderId' element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path='/track-order' element={<OrderTracking />} />
        <Route path='/payment' element={<Checkoutpayment />} />

        {/* Blog Routes */}
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blog/:slug' element={<BlogDetail />} />
      </Routes>
      {!isComingSoon && <Footer />}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <Signup onClose={() => setIsSignupOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default UserRoute
