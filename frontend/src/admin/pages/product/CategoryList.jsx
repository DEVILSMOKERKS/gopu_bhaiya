'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAdmin } from '../../../context/AdminContext';
import './CategoryList.css';

const CategoryList = () => {
  const { token } = useAdmin();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

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
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(categoryId);
    try {
      const response = await axios.delete(`${API_URL}/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        alert('Category deleted successfully!');
      } else {
        const result = response.data;
        alert(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="categorylist-container">
        <div className="categorylist-loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="categorylist-container">
      <div className="categorylist-header">
        <h1 className="categorylist-title">Product Categories</h1>
        <div className="categorylist-header-actions">
          <div className="categorylist-search-container">
            <div className="categorylist-search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="categorylist-search-input"
            />
          </div>
          <button
            onClick={() => router.push('/admin/categories/create')}
            className="categorylist-add-btn"
          >
            + Add Category
          </button>
        </div>
      </div>

      {error && (
        <div className="categorylist-error">
          {error}
        </div>
      )}

      <div className="categorylist-table-container">
        <table className="categorylist-table">
          <thead className="categorylist-table-header">
            <tr>
              <th className="categorylist-th">ID</th>
              <th className="categorylist-th">Name</th>
              <th className="categorylist-th">Slug</th>
              <th className="categorylist-th">Description</th>
              <th className="categorylist-th">Status</th>
              <th className="categorylist-th">Image</th>
              <th className="categorylist-th">Actions</th>
            </tr>
          </thead>
          <tbody className="categorylist-table-body">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="7" className="categorylist-empty-message">
                  {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
                </td>
              </tr>
            ) : (
              filteredCategories.map(category => (
                <tr key={category.id} className="categorylist-table-row">
                  <td className="categorylist-td categorylist-id-cell">{category.id}</td>
                  <td className="categorylist-td categorylist-name-cell">{category.name}</td>
                  <td className="categorylist-td categorylist-slug-cell">{category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}</td>
                  <td className="categorylist-td categorylist-description-cell">{category.description || '-'}</td>
                  <td className="categorylist-td categorylist-status-cell">
                    <span className="categorylist-status-badge active">active</span>
                  </td>
                  <td className="categorylist-td categorylist-image-cell">
                    {category.image_url ? (
                      <img 
                        src={`${API_URL.replace('/api', '')}${category.image_url}`} 
                        alt={category.name}
                        className="categorylist-category-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="categorylist-no-image">
                        <span className="categorylist-no-image-text">{category.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="categorylist-td categorylist-actions-cell">
                    <div className="categorylist-action-buttons">
                      <button
                        onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                        className="categorylist-action-btn categorylist-edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="categorylist-action-btn categorylist-delete-btn"
                        disabled={deleteLoading === category.id}
                        title="Delete"
                      >
                        {deleteLoading === category.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
