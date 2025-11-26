import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../../../context/AdminContext';
import './SubcategoryList.css';

const SubcategoryList = () => {
  const { token } = useAdmin();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/subcategories`);
      const result = response.data;
      
      if (response.status === 200) {
        setSubcategories(result.data);
      } else {
        setError('Failed to load subcategories');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to load subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(subcategoryId);
    try {
      const response = await axios.delete(`${API_URL}/subcategories/${subcategoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setSubcategories(prev => prev.filter(sub => sub.id !== subcategoryId));
        alert('Subcategory deleted successfully!');
      } else {
        const result = response.data;
        alert(result.message || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('An error occurred while deleting the subcategory');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subcategory.description && subcategory.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (subcategory.category_name && subcategory.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="subcategorylist-container">
        <div className="subcategorylist-loading">Loading subcategories...</div>
      </div>
    );
  }

  return (
    <div className="subcategorylist-container">
      <div className="subcategorylist-header">
        <h1 className="subcategorylist-title">Product Subcategories</h1>
        <div className="subcategorylist-header-actions">
          <div className="subcategorylist-search-container">
            <div className="subcategorylist-search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="subcategorylist-search-input"
            />
          </div>
          <button
            onClick={() => navigate('/admin/subcategories/create')}
            className="subcategorylist-add-btn"
          >
            + Add Subcategory
          </button>
        </div>
      </div>

      {error && (
        <div className="subcategorylist-error">
          {error}
        </div>
      )}

      <div className="subcategorylist-table-container">
        <table className="subcategorylist-table">
          <thead className="subcategorylist-table-header">
            <tr>
              <th className="subcategorylist-th">ID</th>
              <th className="subcategorylist-th">Name</th>
              <th className="subcategorylist-th">Parent Category</th>
              <th className="subcategorylist-th">Slug</th>
              <th className="subcategorylist-th">Description</th>
              <th className="subcategorylist-th">Status</th>
              <th className="subcategorylist-th">Image</th>
              <th className="subcategorylist-th">Actions</th>
            </tr>
          </thead>
          <tbody className="subcategorylist-table-body">
            {filteredSubcategories.length === 0 ? (
              <tr>
                <td colSpan="8" className="subcategorylist-empty-message">
                  {searchTerm ? 'No subcategories found matching your search.' : 'No subcategories found.'}
                </td>
              </tr>
            ) : (
              filteredSubcategories.map(subcategory => (
                <tr key={subcategory.id} className="subcategorylist-table-row">
                  <td className="subcategorylist-td subcategorylist-id-cell">{subcategory.id}</td>
                  <td className="subcategorylist-td subcategorylist-name-cell">{subcategory.name}</td>
                  <td className="subcategorylist-td subcategorylist-parent-cell">
                    {subcategory.category_name || '-'}
                  </td>
                  <td className="subcategorylist-td subcategorylist-slug-cell">
                    {subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-')}
                  </td>
                  <td className="subcategorylist-td subcategorylist-description-cell">
                    {subcategory.description || '-'}
                  </td>
                  <td className="subcategorylist-td subcategorylist-status-cell">
                    <span className="subcategorylist-status-badge active">active</span>
                  </td>
                  <td className="subcategorylist-td subcategorylist-image-cell">
                    {subcategory.image_url ? (
                      <img 
                        src={`${API_URL.replace('/api', '')}${subcategory.image_url}`} 
                        alt={subcategory.name}
                        className="subcategorylist-subcategory-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="subcategorylist-no-image">
                        <span className="subcategorylist-no-image-text">{subcategory.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="subcategorylist-td subcategorylist-actions-cell">
                    <div className="subcategorylist-action-buttons">
                      <button
                        onClick={() => navigate(`/admin/subcategories/edit/${subcategory.id}`)}
                        className="subcategorylist-action-btn subcategorylist-edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        className="subcategorylist-action-btn subcategorylist-delete-btn"
                        disabled={deleteLoading === subcategory.id}
                        title="Delete"
                      >
                        {deleteLoading === subcategory.id ? '⏳' : '🗑️'}
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

export default SubcategoryList;
