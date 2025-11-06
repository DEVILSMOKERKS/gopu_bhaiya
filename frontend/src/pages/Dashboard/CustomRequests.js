import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiFileText, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';

const CustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    designDescription: '',
    preferredMaterial: '',
    dimensions: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/custom-requests');
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch custom requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/custom-requests', formData);
      toast.success('Custom request submitted successfully');
      setFormData({ designDescription: '', preferredMaterial: '', dimensions: '' });
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'in_progress':
        return <FiFileText className="text-blue-500" />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiX className="text-red-500" />;
      default:
        return <FiFileText />;
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
        <title>Custom Requests - Mateshwari Exports</title>
      </Helmet>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-heading font-bold text-gray-900">Custom Requests</h1>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              New Request
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Submit Custom Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Design Description *
                  </label>
                  <textarea
                    value={formData.designDescription}
                    onChange={(e) => setFormData({ ...formData, designDescription: e.target.value })}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                    placeholder="Describe your custom design requirements..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Material
                    </label>
                    <input
                      type="text"
                      value={formData.preferredMaterial}
                      onChange={(e) => setFormData({ ...formData, preferredMaterial: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                      placeholder="e.g., White Marble"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                      placeholder="e.g., 12x12x18 inches"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FiFileText className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">No custom requests yet</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Request #{request.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="font-semibold capitalize">{request.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Design Description:</p>
                      <p className="text-gray-600">{request.designDescription}</p>
                    </div>
                    {request.preferredMaterial && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Preferred Material:</p>
                        <p className="text-gray-600">{request.preferredMaterial}</p>
                      </div>
                    )}
                    {request.dimensions && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dimensions:</p>
                        <p className="text-gray-600">{request.dimensions}</p>
                      </div>
                    )}
                    {request.estimatedPrice && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimated Price:</p>
                        <p className="text-gold-600 font-semibold">
                          ₹{request.estimatedPrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                    {request.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                        <p className="text-gray-600">{request.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomRequests;

