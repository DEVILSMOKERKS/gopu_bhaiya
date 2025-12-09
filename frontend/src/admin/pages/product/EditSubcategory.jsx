'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { useAdmin } from '../../../context/AdminContext';
import './EditSubcategory.css';

const EditSubcategory = ({ id }) => {
  const { token } = useAdmin();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategoryLoading, setSubcategoryLoading] = useState(true);
  const [error, setError] = useState('');

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchCategories();
    fetchSubcategory();
  }, [id]);

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

  const fetchSubcategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/subcategories/${id}`);
      const result = response.data;

      if (response.status === 200) {
        setFormData({
          name: result.data.name,
          description: result.data.description || '',
          category_id: result.data.category_id
        });
        setCurrentImage(result.data.image_url);
      } else {
        setError('Failed to load subcategory');
      }
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      setError('Failed to load subcategory');
    } finally {
      setSubcategoryLoading(false);
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
      formDataToSend.append('category_id', formData.category_id);
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      const response = await axios.put(`${API_URL}/subcategories/${id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = response.data;

      if (response.status === 200) {
        alert('Subcategory updated successfully!');
        router.push('/admin/subcategories');
      } else {
        setError(result.message || 'Failed to update subcategory');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      setError('An error occurred while updating the subcategory');
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading || subcategoryLoading) {
    return (
      <div className="editsubcategory-container">
        <div className="editsubcategory-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="editsubcategory-container">
      <div className="editsubcategory-header">
        <h1>Edit Subcategory</h1>
        <p>Update subcategory information</p>
      </div>

      <form onSubmit={handleSubmit} className="editsubcategory-form">
        <div className="editsubcategory-form-section">
          <h2>Basic Information</h2>

          <div className="editsubcategory-form-group">
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

          <div className="editsubcategory-form-group">
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

          <div className="editsubcategory-form-group">
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

        <div className="editsubcategory-form-section">
          <h2>Subcategory Image</h2>

          <div className="editsubcategory-form-group">
            <label htmlFor="image">Subcategory Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />

            {/* Current image display */}
            {currentImage && !imagePreview && (
              <div className="editsubcategory-image-preview">
                <p>Current Image:</p>
                <Image
                  src={`${API_URL.replace('/api', '')}${currentImage}`}
                  alt="Current subcategory"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="editsubcategory-no-image" style={{ display: 'none' }}>
                  <span>Image not found</span>
                </div>
              </div>
            )}

            {/* New image preview */}
            {imagePreview && (
              <div className="editsubcategory-image-preview">
                <p>New Image Preview:</p>
                <Image src={imagePreview} alt="Preview" width={200} height={200} style={{ objectFit: 'cover', borderRadius: '8px', maxWidth: '200px', maxHeight: '200px' }} />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="editsubcategory-error-message">
            {error}
          </div>
        )}

        <div className="editsubcategory-form-actions">
          <button
            type="button"
            onClick={() => router.push('/admin/subcategories')}
            className="editsubcategory-btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="editsubcategory-btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Subcategory'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubcategory;
