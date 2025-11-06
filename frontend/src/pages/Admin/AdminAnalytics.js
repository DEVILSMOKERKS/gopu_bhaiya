import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FiPackage, FiShoppingCart, FiDollarSign, FiClock, FiFileText } from 'react-icons/fi';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  const stats = [
    {
      label: 'Total Products',
      value: analytics.totalProducts,
      icon: <FiPackage className="text-4xl" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders,
      icon: <FiShoppingCart className="text-4xl" />,
      color: 'bg-green-500',
    },
    {
      label: 'Total Revenue',
      value: `₹${analytics.totalRevenue.toLocaleString('en-IN')}`,
      icon: <FiDollarSign className="text-4xl" />,
      color: 'bg-gold-500',
    },
    {
      label: 'Pending Orders',
      value: analytics.pendingOrders,
      icon: <FiClock className="text-4xl" />,
      color: 'bg-yellow-500',
    },
    {
      label: 'Custom Requests',
      value: analytics.customRequests,
      icon: <FiFileText className="text-4xl" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className={`${stat.color} text-white p-4 rounded-lg w-fit mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;

