'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { useAdmin } from '../../../context/AdminContext';
import './CreateSubcategory.css';

const CreateSubcategory = () => {
  const { token } = useAdmin();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const result = response.data;

      if (response.status === 200) {
        setCategories(result.data);
      } else {
        setError('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
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
      formDataToSend.append('category_id', formData.category_id);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post(`${API_URL}/subcategories`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (response.status === 201) {
        alert('Subcategory created successfully!');
        router.push('/admin/subcategories');
      } else {
        setError(result.message || 'Failed to create subcategory');
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      setError('An error occurred while creating the subcategory');
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="createsubcategory-container">
        <div className="createsubcategory-loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="createsubcategory-container">
      <div className="createsubcategory-header">
        <h1>Create New Subcategory</h1>
        <p>Add a new product subcategory to organize your products</p>
      </div>

      <form onSubmit={handleSubmit} className="createsubcategory-form">
        <div className="createsubcategory-form-section">
          <h2>Basic Information</h2>

          <div className="createsubcategory-form-group">
            <label htmlFor="category_id">Parent Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="createsubcategory-form-group">
            <label htmlFor="name">Subcategory Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter subcategory name"
            />
          </div>

          <div className="createsubcategory-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter subcategory description"
            />
          </div>
        </div>

        <div className="createsubcategory-form-section">
          <h2>Subcategory Image</h2>

          <div className="createsubcategory-form-group">
            <label htmlFor="image">Subcategory Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="createsubcategory-image-preview">
                <Image src={imagePreview} alt="Preview" width={60} height={60} style={{ objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="createsubcategory-error-message">
            {error}
          </div>
        )}

        <div className="createsubcategory-form-actions">
          <button
            type="button"
            onClick={() => router.push('/admin/subcategories')}
            className="createsubcategory-btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="createsubcategory-btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Subcategory'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubcategory;
