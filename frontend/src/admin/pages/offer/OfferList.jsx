import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import './OfferList.css';

const OfferList = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOffers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await axios.get(`${API_URL}/offers?${params}`);
      const data = response.data;

      if (data.success) {
        setOffers(data.data);
        setTotalPages(data.pagination?.total_pages || 1);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${API_URL}/offers/${offerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        alert('Offer deleted successfully!');
        fetchOffers();
      } else {
        alert(data.message || 'Failed to delete offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Failed to delete offer');
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const isOfferActive = (offer) => {
    const now = new Date();
    const validFrom = offer.valid_from ? new Date(offer.valid_from) : null;
    const validTo = offer.valid_to ? new Date(offer.valid_to) : null;

    if (offer.status !== 'active') return false;
    if (validFrom && now < validFrom) return false;
    if (validTo && now > validTo) return false;
    return true;
  };

  return (
    <div className="offer-list-container">
      <div className="offer-list-header">
        <div className="header-left">
          <h1>Special Offers</h1>
          <p>Manage your special offers and promotions</p>
        </div>
        <button
          className="add-btn"
          onClick={() => navigate('/admin/offers/create')}
        >
          <FaPlus /> Add New Offer
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FaFilter />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading offers...</p>
        </div>
      ) : (
        <>
          <div className="offers-grid">
            {offers.length === 0 ? (
              <div className="no-offers">
                <p>No offers found</p>
                <button
                  className="add-btn"
                  onClick={() => navigate('/admin/offers/create')}
                >
                  <FaPlus /> Create Your First Offer
                </button>
              </div>
            ) : (
              offers.map((offer) => (
                <div key={offer.offer_id} className="offer-card">
                  <div className="offer-header">
                    <h3>{offer.offer_title}</h3>
                    <div className="offer-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => navigate(`/admin/offers/edit/${offer.offer_id}`)}
                        title="Edit Offer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(offer.offer_id)}
                        title="Delete Offer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="offer-content">
                    <div className="offer-info">
                      <div className="info-row">
                        <span className="label">Discount:</span>
                        <span className="value discount">{offer.discount_percent}% OFF</span>
                      </div>
                      


                      <div className="info-row">
                        <span className="label">Valid From:</span>
                        <span className="value">{formatDate(offer.valid_from)}</span>
                      </div>

                      <div className="info-row">
                        <span className="label">Valid To:</span>
                        <span className="value">{formatDate(offer.valid_to)}</span>
                      </div>

                      <div className="info-row">
                        <span className="label">Status:</span>
                        <span className="value">{getStatusBadge(offer.status)}</span>
                      </div>

                      {isOfferActive(offer) && (
                        <div className="active-indicator">
                          <span className="active-badge">Currently Active</span>
                        </div>
                      )}
                    </div>

                    {offer.offer_description && (
                      <div className="offer-description">
                        <p>{offer.offer_description}</p>
                      </div>
                    )}
                  </div>

                  <div className="offer-footer">
                    <small>Created: {formatDate(offer.created_at)}</small>
                    {offer.updated_at && offer.updated_at !== offer.created_at && (
                      <small>Updated: {formatDate(offer.updated_at)}</small>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OfferList;
