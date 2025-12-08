'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaDownload } from 'react-icons/fa';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, subcategoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/subcategories`);
      if (response.data.success) {
        setSubcategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category_id: categoryFilter }),
        ...(subcategoryFilter && { subcategory_id: subcategoryFilter })
      });

      const response = await axios.get(`${API_URL}/products?${params}`);
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.total_pages);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to delete product');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`productlist-status-badge ${status}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getPriceRange = (product) => {
    if (product.min_price && product.max_price) {
      if (product.min_price === product.max_price) {
        return `₹${product.min_price}`;
      }
      return `₹${product.min_price} - ₹${product.max_price}`;
    }
    return 'N/A';
  };

  const getDefaultImage = (product) => {
    if (product.colors && product.colors.length > 0) {
      const defaultColor = product.colors.find(color =>
        color.images && color.images.length > 0
      );
      if (defaultColor && defaultColor.images.length > 0) {
        return `${API_URL.replace('/api', '')}${defaultColor.images[0]}`;
      }
    }
    return '/placeholder-product.jpg';
  };

  const exportToCSV = async () => {
    try {
      setLoading(true);

      // Fetch all products for export (without pagination)
      const params = new URLSearchParams({
        limit: 10000, // Large number to get all products
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category_id: categoryFilter }),
        ...(subcategoryFilter && { subcategory_id: subcategoryFilter })
      });

      const response = await axios.get(`${API_URL}/products?${params}`);

      if (response.data.success) {
        const allProducts = response.data.data;

        // Prepare CSV data
        const csvHeaders = [
          'Product ID',
          'Product Name',
          'SKU',
          'Description',
          'Category',
          'Subcategory',
          'Min Price',
          'Max Price',
          'Rate',
          'Status',
          'Created Date',
          'Updated Date',
          'Colors',
          'Sizes',
          'Total Stock',
          'Images Count'
        ];

        const csvData = allProducts.map(product => {
          // Get all colors
          const colors = product.colors ? product.colors.map(color => color.color_name).join('; ') : 'N/A';

          // Get all sizes
          const sizes = product.sizes ? product.sizes.map(size => `${size.size} (₹${size.sell_price})`).join('; ') : 'N/A';

          // Calculate total stock
          const totalStock = product.sizes ? product.sizes.reduce((sum, size) => sum + (size.stock || 0), 0) : 0;

          // Count total images
          const totalImages = product.colors ? product.colors.reduce((sum, color) => sum + (color.images ? color.images.length : 0), 0) : 0;

          return [
            product.product_id || '',
            `"${product.name || ''}"`,
            product.sku || '',
            `"${product.description || ''}"`,
            product.category_name || '',
            product.subcategory_name || '',
            product.min_price || '',
            product.max_price || '',
            product.rate || '',
            product.status || '',
            product.created_at ? new Date(product.created_at).toLocaleDateString() : '',
            product.updated_at ? new Date(product.updated_at).toLocaleDateString() : '',
            `"${colors}"`,
            `"${sizes}"`,
            totalStock,
            totalImages
          ];
        });

        // Create CSV content
        const csvContent = [
          csvHeaders.join(','),
          ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `product_inventory_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Product inventory exported successfully!');
      } else {
        alert('Failed to fetch products for export');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export product inventory');
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="productlist-container">
        <div className="productlist-loading">
          <div className="productlist-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productlist-container">
      <div className="productlist-header">
        <h1>PRODUCT LISTING</h1>
      </div>

      <div className="productlist-controls">
        <div className="productlist-search-section">
          <div className="productlist-search-box">
            <FaSearch className="productlist-search-icon" />
            <input
              type="text"
              placeholder="Search Product by name, SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="productlist-filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="productlist-filter-dropdown"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="productlist-filter-dropdown"
            >
              <option value="">All Subcategories</option>
              {subcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="productlist-filter-dropdown"
            >
              <option value="">Active</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="productlist-action-buttons">
          <button
            className="productlist-action-btn productlist-export-btn"
            onClick={exportToCSV}
            disabled={loading}
          >
            <FaDownload /> Export CSV
          </button>
          <Link href="/admin/products/create" className="productlist-action-btn productlist-add-product-btn">
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="productlist-error-message">
          {error}
        </div>
      )}

      <div className="productlist-table-container">
        <table className="productlist-table">
          <thead className="productlist-table-header">
            <tr>
              <th className="productlist-th productlist-checkbox-th">
                <input type="checkbox" className="productlist-select-all" />
              </th>
              <th className="productlist-th">PRODUCT</th>
              <th className="productlist-th">CATEGORY</th>
              <th className="productlist-th">SUB CATEGORY</th>
              <th className="productlist-th">PRICE</th>
              <th className="productlist-th">STATUS</th>
              <th className="productlist-th">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="productlist-table-body">
            {products.map(product => (
              <tr key={product.product_id} className="productlist-table-row">
                <td className="productlist-td productlist-checkbox-td">
                  <input type="checkbox" className="productlist-product-checkbox" />
                </td>
                <td className="productlist-td productlist-product-td">
                  <div className="productlist-product-info">
                    <Image
                      src={getDefaultImage(product)}
                      alt={product.name}
                      className="productlist-product-image"
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div className="productlist-product-details">
                      <h4 className="productlist-product-name">{product.name}</h4>
                      <p className="productlist-product-sku">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="productlist-td productlist-category-td">
                  {product.category_name || 'N/A'}
                </td>
                <td className="productlist-td productlist-subcategory-td">
                  {product.subcategory_name || 'N/A'}
                </td>
                <td className="productlist-td productlist-price-td">
                  <div className="productlist-price-info">
                    <span className="productlist-price">{getPriceRange(product)}</span>
                    {product.rate && (
                      <p className="productlist-rate">Rate: ₹{product.rate}</p>
                    )}
                  </div>
                </td>
                <td className="productlist-td productlist-status-td">
                  {getStatusBadge(product.status)}
                </td>
                <td className="productlist-td productlist-actions-td">
                  <div className="productlist-action-buttons-small">
                    <Link
                      href={`/admin/products/view/${product.product_id}`}
                      className="productlist-action-btn-small productlist-view-btn"
                      title="View Product"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product.product_id}`}
                      className="productlist-action-btn-small productlist-edit-btn"
                      title="Edit Product"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="productlist-action-btn-small productlist-delete-btn"
                      onClick={() => handleDelete(product.product_id)}
                      title="Delete Product"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !loading && (
        <div className="productlist-empty-state">
          <div className="productlist-empty-icon">📦</div>
          <h3>No products found</h3>
          <p>Start by adding your first product to the catalog</p>
          <Link href="/admin/products/create" className="productlist-add-first-product-btn">
            <FaPlus /> Add Your First Product
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="productlist-pagination">
          <button
            className="productlist-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <div className="productlist-page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`productlist-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="productlist-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
