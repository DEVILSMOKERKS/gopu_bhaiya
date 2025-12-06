'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './OfferForm.css';

const EditOffer = ({ offerId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    offer_title: '',
    offer_description: '',
    discount_percent: 0,
    valid_from: '',
    valid_to: '',
    status: 'active'
  });

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers/${offerId}`);
      const data = response.data;

      if (data.success) {
        const offer = data.data;

        setFormData({
          offer_title: offer.offer_title || '',
          offer_description: offer.offer_description || '',
          discount_percent: offer.discount_percent || 0,
          valid_from: offer.valid_from ? offer.valid_from.split('T')[0] : '',
          valid_to: offer.valid_to ? offer.valid_to.split('T')[0] : '',
          status: offer.status || 'active'
        });
      } else {
        alert('Offer not found');
        router.push('/admin/offers');
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
      alert('Failed to load offer');
      navigate('/admin/offers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.offer_title || !formData.discount_percent) {
      alert('Offer title and discount percent are required');
      return;
    }

    if (formData.discount_percent < 0 || formData.discount_percent > 100) {
      alert('Discount percent must be between 0 and 100');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/offers/${offerId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        alert('Offer updated successfully!');
        router.push('/admin/offers');
      } else {
        alert(data.message || 'Failed to update offer');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Failed to update offer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="offer-form-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading offer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-form-container">
      <div className="offer-form-header">
        <button
          className="back-btn"
          onClick={() => navigate('/admin/offers')}
        >
          <FaArrowLeft /> Back to Offers
        </button>
        <h1>Edit Offer</h1>
        <p>Update offer information</p>
      </div>

      <form onSubmit={handleSubmit} className="offer-form">
        <div className="form-section">
          <h2>Offer Details</h2>

          <div className="form-group">
            <label>Offer Title *</label>
            <input
              type="text"
              name="offer_title"
              value={formData.offer_title}
              onChange={handleInputChange}
              placeholder="e.g., Summer Sale"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="offer_description"
              value={formData.offer_description}
              onChange={handleInputChange}
              placeholder="Offer description..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Discount % *</label>
            <input
              type="number"
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valid From</label>
              <input
                type="date"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Valid To</label>
              <input
                type="date"
                name="valid_to"
                value={formData.valid_to}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin/offers')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner"></div>
                Updating...
              </>
            ) : (
              <>
                <FaSave />
                Update Offer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOffer;
