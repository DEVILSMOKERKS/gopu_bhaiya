'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './ProductReview.css';

const ProductReview = ({ productId, productName }) => {
  const { user, isAuthenticated } = useUser();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review_text: '',
    review_image: null
  });
  const [submitting, setSubmitting] = useState(false);

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch reviews on component mount
  useEffect(() => {
    if (productId) {
      fetchReviews();
      if (isAuthenticated) {
        fetchUserReview();
      }
    }
  }, [productId, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reviews/product/${productId}`);

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setAverageRating(response.data.data.average_rating);
        setTotalReviews(response.data.data.total_reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await axios.get(`${API_URL}/reviews/user/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        setUserReview(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.rating) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const formDataToSend = new FormData();
      formDataToSend.append('product_id', productId);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('review_text', formData.review_text);
      if (formData.review_image) {
        formDataToSend.append('review_image', formData.review_image);
      }

      const response = await axios.post(`${API_URL}/reviews`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        alert('Review submitted successfully! It will be visible after approval.');
        setShowReviewModal(false);
        setFormData({ rating: 0, review_text: '', review_image: null });
        fetchReviews();
        fetchUserReview();
      } else {
        alert(result.message || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!formData.rating) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const formDataToSend = new FormData();
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('review_text', formData.review_text);
      if (formData.review_image) {
        formDataToSend.append('review_image', formData.review_image);
      }

      const response = await axios.put(`${API_URL}/reviews/${userReview.review_id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        alert('Review updated successfully!');
        setShowEditModal(false);
        setFormData({ rating: 0, review_text: '', review_image: null });
        fetchReviews();
        fetchUserReview();
      } else {
        alert(result.message || 'Error updating review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await axios.delete(`${API_URL}/reviews/${userReview.review_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        alert('Review deleted successfully!');
        setUserReview(null);
        fetchReviews();
      } else {
        alert(result.message || 'Error deleting review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      alert('Please login to like reviews');
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await axios.post(`${API_URL}/reviews/${reviewId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (result.success) {
        fetchReviews(); // Refresh reviews to update like count
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const openReviewModal = () => {
    setFormData({ rating: 0, review_text: '', review_image: null });
    setShowReviewModal(true);
  };

  const openEditModal = () => {
    setFormData({
      rating: userReview.rating,
      review_text: userReview.review_text || '',
      review_image: null
    });
    setShowEditModal(true);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="product-review-section">
        <div className="review-loading">
          <div className="loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-review-section">
      {/* Review Header */}
      <div className="review-header">
        <h3>CUSTOMER REVIEW</h3>
        {isAuthenticated && !userReview && (
          <button className="write-review-btn" onClick={openReviewModal}>
            Write A Review
          </button>
        )}
      </div>

      {/* User's Review Section */}
      {isAuthenticated && userReview && (
        <div className="user-review-section">
          <div className="user-review-header">
            <h4>Your Review</h4>
            <div className="user-review-actions">
              <button className="edit-review-btn" onClick={openEditModal}>
                Edit
              </button>
              <button className="delete-review-btn" onClick={handleDeleteReview}>
                Delete
              </button>
            </div>
          </div>
          <div className="user-review-content">
            <div className="user-review-rating">
              <div className="reviewer-info">
                <Image
                  src={user?.photo ? `${API_URL.replace('/api', '')}${user.photo}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcgMTYuMzMgNyAxOVYyMEgxN1YxOUMxNyAxNi4zMyAxNC42NyAxNCAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo='}
                  alt={user?.name || 'User'}
                  className="reviewer-avatar"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcgMTYuMzMgNyAxOVYyMEgxN1YxOUMxNyAxNi4zMyAxNC42NyAxNCAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                  }}
                />
                <span className="reviewer-name">{user?.name || 'You'}</span>
              </div>
              {renderStars(userReview.rating)}
              <span className="review-date">{formatDate(userReview.created_at)}</span>
            </div>
            {userReview.review_text && (
              <p className="user-review-text">{userReview.review_text}</p>
            )}
            {userReview.review_image && (
              <img
                src={`${API_URL.replace('/api', '')}${userReview.review_image}`}
                alt="Review"
                className="user-review-image"
              />
            )}
            {userReview.status === 'rejected' && (
              <div className="review-status">
                Status: <span className="status-rejected">Rejected</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.review_id} className="review-item">
              <div className="review-header-info">
                <div className="reviewer-info">
                  <img
                    src={review.user_photo ? `${API_URL.replace('/api', '')}${review.user_photo}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcgMTYuMzMgNyAxOVYyMEgxN1YxOUMxNyAxNi4zMyAxNC42NyAxNCAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo='}
                    alt={review.user_name}
                    className="reviewer-avatar"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDE0IDcgMTYuMzMgNyAxOVYyMEgxN1YxOUMxNyAxNi4zMyAxNC42NyAxNCAxMiAxNFoiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                    }}
                  />
                  <span className="reviewer-name">{review.user_name}</span>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="review-date">{formatDate(review.created_at)}</span>
                </div>
              </div>
              {review.review_text && (
                <p className="review-text">{review.review_text}</p>
              )}
              {review.review_image && (
                <img
                  src={`${API_URL.replace('/api', '')}${review.review_image}`}
                  alt="Review"
                  className="review-image"
                />
              )}
              <div className="review-actions">
                <button
                  className="like-review-btn"
                  onClick={() => handleLikeReview(review.review_id)}
                >
                  👍 {review.likes_count || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <div className="no-reviews-icon">⭐</div>
          <h4>No Reviews Yet</h4>
          <p>Be the first one to review this product!</p>
          {isAuthenticated && !userReview && (
            <button className="write-review-btn" onClick={openReviewModal}>
              Write A Review
            </button>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Review</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowReviewModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Rating:</label>
                {renderStars(formData.rating, true, (star) =>
                  setFormData(prev => ({ ...prev, rating: star }))
                )}
              </div>
              <div className="form-group">
                <label>Your Review:</label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, review_image: e.target.files[0] }))}
                />
              </div>
              <button type="submit" className="submit-review-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Review</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateReview} className="review-form">
              <div className="form-group">
                <label>Rating:</label>
                {renderStars(formData.rating, true, (star) =>
                  setFormData(prev => ({ ...prev, rating: star }))
                )}
              </div>
              <div className="form-group">
                <label>Your Review:</label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Upload New Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, review_image: e.target.files[0] }))}
                />
              </div>
              <button type="submit" className="submit-review-btn" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
