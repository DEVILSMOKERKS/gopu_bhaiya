import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../../../context/AdminContext';
import './CreateCategory.css';

const CreateCategory = () => {
  const { token } = useAdmin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
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
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post(`${API_URL}/categories`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Category created successfully!');
        navigate('/admin/categories');
      } else {
        setError(response.data.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setError('An error occurred while creating the category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createcategory-container">
      <div className="createcategory-header">
        <h1>Create New Category</h1>
        <p>Add a new product category to organize your products</p>
      </div>

      <form onSubmit={handleSubmit} className="createcategory-form">
        <div className="createcategory-form-section">
          <h2>Basic Information</h2>
          
          <div className="createcategory-form-group">
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

          <div className="createcategory-form-group">
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

        <div className="createcategory-form-section">
          <h2>Category Image</h2>
          
          <div className="createcategory-form-group">
            <label htmlFor="image">Category Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="createcategory-image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="createcategory-error-message">
            {error}
          </div>
        )}

        <div className="createcategory-form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="createcategory-btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="createcategory-btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
