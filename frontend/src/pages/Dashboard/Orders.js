import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiPackage, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiPackage className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiPackage />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Mateshwari Exports</title>
      </Helmet>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container-custom">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">No orders yet</p>
              <a href="/shop" className="btn-primary">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold capitalize">{order.status}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{(item.product?.price || 0) * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Status:</p>
                      <p className={`font-semibold capitalize ${
                        order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.paymentStatus}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-gold-600">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Tracking Number: <span className="font-semibold">{order.trackingNumber}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;

