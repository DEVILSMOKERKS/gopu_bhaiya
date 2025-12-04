'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../context/AdminContext';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import AdminAuthPopup from './auth-popup/AdminAuthPopup';
import '../../admin/AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { admin, isAuthenticated, loading, login, logout } = useAdmin();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      setShowAuthPopup(true);
    }
  }, [isAuthenticated, loading]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      setShowAuthPopup(false);
      router.push('/admin/dashboard');
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setShowAuthPopup(true);
    router.push('/admin');
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

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

  if (!isAuthenticated) {
    return (
      <AdminAuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      <div className="admin-main-content">
        <Header
          adminUser={admin}
          onLogout={handleLogout}
          onToggleMobileSidebar={toggleMobileSidebar}
        />

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

