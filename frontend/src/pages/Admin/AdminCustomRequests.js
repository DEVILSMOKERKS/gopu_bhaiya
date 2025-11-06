import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/custom-requests');
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch custom requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id, status, estimatedPrice, notes) => {
    try {
      await api.put(`/admin/custom-requests/${id}`, {
        status,
        estimatedPrice,
        notes,
      });
      toast.success('Request updated');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">Custom Requests</h1>
      <div className="space-y-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Request #{request.id}</h3>
                <p className="text-sm text-gray-500">
                  {request.User?.name} - {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                value={request.status}
                onChange={(e) => updateRequest(request.id, e.target.value, request.estimatedPrice, request.notes)}
                className="px-3 py-1 border border-gray-300 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2 mb-4">
              <p><strong>Description:</strong> {request.designDescription}</p>
              {request.preferredMaterial && <p><strong>Material:</strong> {request.preferredMaterial}</p>}
              {request.dimensions && <p><strong>Dimensions:</strong> {request.dimensions}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Price</label>
                <input
                  type="number"
                  defaultValue={request.estimatedPrice || ''}
                  onBlur={(e) => updateRequest(request.id, request.status, e.target.value, request.notes)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter estimated price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  defaultValue={request.notes || ''}
                  onBlur={(e) => updateRequest(request.id, request.status, request.estimatedPrice, e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Admin notes..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomRequests;

