'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAdmin } from '../../../context/AdminContext';
import './EditCategory.css';

const EditCategory = ({ id }) => {
  const { token } = useAdmin();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = response.data;

      if (response.status === 200) {
        setFormData({
          name: result.data.name,
          description: result.data.description || ''
        });
        setCurrentImage(result.data.image_url);
      } else {
        setError('Failed to load category');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to load category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      const response = await axios.put(`${API_URL}/categories/${id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (response.status === 200) {
        alert('Category updated successfully!');
        router.push('/admin/categories');
      } else {
        setError(result.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('An error occurred while updating the category');
    } finally {
      setLoading(false);
    }
  };

  if (categoryLoading) {
    return (
      <div className="editcategory-container">
        <div className="editcategory-loading">Loading category...</div>
      </div>
    );
  }

  return (
    <div className="editcategory-container">
      <div className="editcategory-header">
        <h1>Edit Category</h1>
        <p>Update category information</p>
      </div>

      <form onSubmit={handleSubmit} className="editcategory-form">
        <div className="editcategory-form-section">
          <h2>Basic Information</h2>

          <div className="editcategory-form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="editcategory-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter category description"
            />
          </div>
        </div>

        <div className="editcategory-form-section">
          <h2>Category Image</h2>

          <div className="editcategory-form-group">
            <label htmlFor="image">Category Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />

            {/* Current image display */}
            {currentImage && !imagePreview && (
              <div className="editcategory-image-preview">
                <p>Current Image:</p>
                <img
                  src={`${API_URL.replace('/api', '')}${currentImage}`}
                  alt="Current category"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="editcategory-no-image" style={{ display: 'none' }}>
                  <span>Image not found</span>
                </div>
              </div>
            )}

            {/* New image preview */}
            {imagePreview && (
              <div className="editcategory-image-preview">
                <p>New Image Preview:</p>
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="editcategory-error-message">
            {error}
          </div>
        )}

        <div className="editcategory-form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="editcategory-btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="editcategory-btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
