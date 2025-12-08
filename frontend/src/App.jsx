import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { UserProvider } from './context/UserContext';
import { WishlistCartProvider } from "./context/wishlistCartContext";
import { NotificationProvider } from './context/NotificationContext';
import { AdminProvider } from './context/AdminContext';
import CanonicalURL from './components/SEO/CanonicalURL';

// Lazy load routes for better performance
const UserRoute = lazy(() => import('./routes/UserRoute'));
const AdminRoute = lazy(() => import('./routes/AdminRoute'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    background: '#f8f9fa'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #956213',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }}></div>
    <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Loading...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AppContent = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, isAdmin]);

  return (
    <>
      <CanonicalURL />
      <Suspense fallback={<LoadingFallback />}>
        {isAdmin ? (
          <NotificationProvider>
            <AdminProvider>
              <AdminRoute />
            </AdminProvider>
          </NotificationProvider>
        ) : (
          <NotificationProvider>
            <UserProvider>
              <WishlistCartProvider>
                <UserRoute
                  onAccountClick={() => setIsSignupOpen(true)}
                  loading={loading}
                  isSignupOpen={isSignupOpen}
                  setIsSignupOpen={setIsSignupOpen}
                />
              </WishlistCartProvider>
            </UserProvider>
          </NotificationProvider>
        )}
      </Suspense>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;