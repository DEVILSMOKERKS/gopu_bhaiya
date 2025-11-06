import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { FiPackage, FiHeart, FiFileText, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const quickLinks = [
    {
      title: 'My Orders',
      description: 'View and track your orders',
      icon: <FiPackage className="text-4xl" />,
      link: '/dashboard/orders',
      color: 'bg-blue-500',
    },
    {
      title: 'Wishlist',
      description: 'Your saved favorites',
      icon: <FiHeart className="text-4xl" />,
      link: '/dashboard/wishlist',
      color: 'bg-red-500',
    },
    {
      title: 'Custom Requests',
      description: 'Track your custom orders',
      icon: <FiFileText className="text-4xl" />,
      link: '/dashboard/custom-requests',
      color: 'bg-purple-500',
    },
    {
      title: 'Profile',
      description: 'Manage your account',
      icon: <FiUser className="text-4xl" />,
      link: '/dashboard/profile',
      color: 'bg-green-500',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Mateshwari Exports</title>
      </Helmet>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Manage your account and orders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
              >
                <div className={`${link.color} text-white p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                  {link.title}
                </h3>
                <p className="text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>

          {/* Recent Activity placeholder */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
              Recent Activity
            </h2>
            <p className="text-gray-600">Your recent orders and activities will appear here</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

