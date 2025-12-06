import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewManagement.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    product_id: ''
  });

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });

      const response = await axios.get(`${API_URL}/reviews/admin/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        setReviews(result.data);
        setTotalPages(result.pagination.total_pages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.put(`${API_URL}/reviews/admin/${reviewId}/status`, { status: newStatus }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        if (newStatus === 'rejected') {
          alert('Review rejected successfully! The review will no longer be visible to users.');
        } else if (newStatus === 'approved') {
          alert('Review approved successfully! The review is now visible to users.');
        } else {
          alert('Review status updated successfully!');
        }
        fetchReviews();
      } else {
        alert(result.message || 'Error updating review status');
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Error updating review status');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.delete(`${API_URL}/reviews/admin/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        alert('Review deleted successfully!');
        fetchReviews();
      } else {
        alert(result.message || 'Error deleting review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="review-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-management">
      <div className="review-management-header">
        <h2>Review Management</h2>
        <p>Manage all product reviews and their approval status. Rejected reviews are hidden from users.</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Product ID:</label>
          <input
            type="text"
            placeholder="Filter by product ID"
            value={filters.product_id}
            onChange={(e) => setFilters(prev => ({ ...prev, product_id: e.target.value }))}
          />
        </div>
        <button
          className="clear-filters-btn"
          onClick={() => setFilters({ status: '', product_id: '' })}
        >
          Clear Filters
        </button>
      </div>

      {/* Reviews Table */}
      <div className="reviews-table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.review_id}>
                <td>#{review.review_id}</td>
                <td>
                  <div className="product-info">
                    <span className="product-name">{review.product_name}</span>
                    <span className="product-id">ID: {review.product_id}</span>
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <img
                      src={review.user_photo ? `${API_URL.replace('/api', '')}${review.user_photo}` : '/src/assets/img/default-avatar.png'}
                      alt={review.user_name}
                      className="user-avatar"
                    />
                    <div>
                      <span className="user-name">{review.user_name}</span>
                      <span className="user-email">{review.user_email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="rating-cell">
                    {renderStars(review.rating)}
                    <span className="rating-number">{review.rating}/5</span>
                  </div>
                </td>
                <td>
                  <div className="review-content">
                    {review.review_text && (
                      <p className="review-text">{review.review_text}</p>
                    )}
                    {review.review_image && (
                      <img
                        src={`${API_URL.replace('/api', '')}${review.review_image}`}
                        alt="Review"
                        className="review-thumbnail"
                      />
                    )}
                    <span className="likes-count">👍 {review.likes_count || 0}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(review.status)}`}>
                    {review.status}
                  </span>
                </td>
                <td>{formatDate(review.created_at)}</td>
                <td>
                  <div className="action-buttons">
                    {review.status === 'pending' && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleStatusUpdate(review.review_id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleStatusUpdate(review.review_id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {review.status === 'rejected' && (
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusUpdate(review.review_id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {review.status === 'approved' && (
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(review.review_id, 'rejected')}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteReview(review.review_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="no-reviews">
          <p>No reviews found matching the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
