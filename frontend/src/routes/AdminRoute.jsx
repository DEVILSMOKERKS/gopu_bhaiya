import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Routes, Route } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import Header from '../admin/components/header/Header'
import Sidebar from '../admin/components/sidebar/Sidebar'
import AdminAuthPopup from '../admin/components/auth-popup/AdminAuthPopup'
import Dashboard from "../admin/pages/Dashboard/Dashboard"
import ResetPassword from "../admin/pages/ResetPassword/ResetPassword"

import CategoryList from "../admin/pages/product/CategoryList"
import CreateCategory from "../admin/pages/product/CreateCategory"
import EditCategory from "../admin/pages/product/EditCategory"
import SubcategoryList from "../admin/pages/product/SubcategoryList"
import CreateSubcategory from "../admin/pages/product/CreateSubcategory"
import EditSubcategory from "../admin/pages/product/EditSubcategory"
import ProductList from "../admin/pages/product/ProductList"
import CreateProduct from "../admin/pages/product/CreateProduct"
import EditProduct from "../admin/pages/product/EditProduct"
import ViewProduct from "../admin/pages/product/ViewProduct"
import ProductAttributes from "../admin/pages/product/ProductAttributes"
import { OfferList, CreateOffer, EditOffer } from "../admin/pages/offer"
import OrderManagement from "../admin/OrderManagement"
import { ReviewManagement } from "../admin/pages/review"
import BlogManagement from "../admin/pages/blog/BlogManagement"
import { UserManagement } from "../admin/pages/users"
import NewsletterSubscribers from "../admin/pages/newsletter/NewsletterSubscribers"
import NewsletterSend from "../admin/pages/newsletter/NewsletterSend"
import NewsletterStatistics from "../admin/pages/newsletter/NewsletterStatistics"
import ContactManagement from "../admin/pages/ContactManagement"
import ExpertConsultationManagement from "../admin/pages/ExpertConsultationManagement"
import '../admin/components/header/adminHeader.css'
import '../admin/components/sidebar/adminSidebar.css'
import '../admin/AdminLayout.css'

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

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/admin" element={
        <AdminLayout>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center',
            color: '#374151'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937' }}>
              Welcome to Mateshwari Moorti Bhandar Admin
            </h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#6b7280' }}>
              Manage your e-commerce store with ease
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '600px',
              width: '100%'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Dashboard</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  View analytics and statistics
                </p>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Products</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Manage your product catalog
                </p>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Orders</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Track and manage orders
                </p>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Users</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Manage customer accounts
                </p>
              </div>
            </div>
          </div>
        </AdminLayout>
      } />
      <Route path="/admin/dashboard" element={
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      } />

      <Route path="/admin/reset-password" element={<ResetPassword />} />
      <Route path="/admin/categories" element={
        <AdminLayout>
          <CategoryList />
        </AdminLayout>
      } />
      <Route path="/admin/categories/create" element={
        <AdminLayout>
          <CreateCategory />
        </AdminLayout>
      } />
      <Route path="/admin/categories/edit/:id" element={
        <AdminLayout>
          <EditCategory />
        </AdminLayout>
      } />
      <Route path="/admin/subcategories" element={
        <AdminLayout>
          <SubcategoryList />
        </AdminLayout>
      } />
      <Route path="/admin/subcategories/create" element={
        <AdminLayout>
          <CreateSubcategory />
        </AdminLayout>
      } />
      <Route path="/admin/subcategories/edit/:id" element={
        <AdminLayout>
          <EditSubcategory />
        </AdminLayout>
      } />

      {/* Product Routes */}
      <Route path="/admin/products" element={
        <AdminLayout>
          <ProductList />
        </AdminLayout>
      } />
      <Route path="/admin/products/create" element={
        <AdminLayout>
          <CreateProduct />
        </AdminLayout>
      } />
      <Route path="/admin/products/edit/:productId" element={
        <AdminLayout>
          <EditProduct />
        </AdminLayout>
      } />
      <Route path="/admin/products/view/:productId" element={
        <AdminLayout>
          <ViewProduct />
        </AdminLayout>
      } />
      <Route path="/admin/product-attributes" element={
        <AdminLayout>
          <ProductAttributes />
        </AdminLayout>
      } />

      {/* Offer Routes */}
      <Route path="/admin/offers" element={
        <AdminLayout>
          <OfferList />
        </AdminLayout>
      } />
      <Route path="/admin/offers/create" element={
        <AdminLayout>
          <CreateOffer />
        </AdminLayout>
      } />
      <Route path="/admin/offers/edit/:offerId" element={
        <AdminLayout>
          <EditOffer />
        </AdminLayout>
      } />

      {/* Order Management Routes */}
      <Route path="/admin/orders" element={
        <AdminLayout>
          <OrderManagement />
        </AdminLayout>
      } />

      {/* Review Management Routes */}
      <Route path="/admin/reviews" element={
        <AdminLayout>
          <ReviewManagement />
        </AdminLayout>
      } />

      {/* Blog Management Routes */}
      <Route path="/admin/blogs" element={
        <AdminLayout>
          <BlogManagement />
        </AdminLayout>
      } />

      {/* User Management Routes */}
      <Route path="/admin/users" element={
        <AdminLayout>
          <UserManagement />
        </AdminLayout>
      } />

      {/* Newsletter Management Routes */}
      <Route path="/admin/newsletter/subscribers" element={
        <AdminLayout>
          <NewsletterSubscribers />
        </AdminLayout>
      } />
      <Route path="/admin/newsletter/send" element={
        <AdminLayout>
          <NewsletterSend />
        </AdminLayout>
      } />
      <Route path="/admin/newsletter/statistics" element={
        <AdminLayout>
          <NewsletterStatistics />
        </AdminLayout>
      } />

      {/* Contact Management Routes */}
      <Route path="/admin/contact-queries" element={
        <AdminLayout>
          <ContactManagement />
        </AdminLayout>
      } />

      {/* Expert Consultation Management Routes */}
      <Route path="/admin/expert-consultations" element={
        <AdminLayout>
          <ExpertConsultationManagement />
        </AdminLayout>
      } />
    </Routes>
  )
}

export default AdminRoute
