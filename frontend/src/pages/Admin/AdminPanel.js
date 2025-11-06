import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiPackage, FiShoppingCart, FiFileText, FiBarChart, FiPlus } from 'react-icons/fi';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCustomRequests from './AdminCustomRequests';
import AdminAnalytics from './AdminAnalytics';

const AdminPanel = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Analytics', icon: <FiBarChart /> },
    { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingCart /> },
    { path: '/admin/custom-requests', label: 'Custom Requests', icon: <FiFileText /> },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Panel - Mateshwari Exports</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg min-h-screen sticky top-0">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-heading font-bold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gold-100 text-gold-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<AdminAnalytics />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/custom-requests" element={<AdminCustomRequests />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;

