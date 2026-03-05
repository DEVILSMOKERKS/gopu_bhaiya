'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import './ProductByCategory.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';

/**
 * Level 1: Categories page at /products
 * Shows grid of categories (Ganesh Temple, Radha Krishna, etc.) from GET /api/categories.
 * Each card links to /products/:categorySlug (variant listing).
 */
const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = API_URL ? API_URL.replace('/api', '') : '';

  useEffect(() => {
    if (!API_URL) {
      setError('API URL not configured');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/categories`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data.filter((c) => c.status !== 'inactive'));
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load categories');
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL]);

  const getCategoryImage = (cat) => {
    if (!cat.image_url) return PLACEHOLDER_IMAGE;
    const path = String(cat.image_url).replace(/\\/g, '/');
    return path.startsWith('http') ? path : `${baseUrl || ''}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return (
      <div className="product-by-category-page">
        <div className="product-by-category-header">
          <h1 className="product-by-category-title">Products</h1>
          <p className="product-by-category-subtitle">Loading categories…</p>
        </div>
        <div className="product-by-category-container">
          <div className="product-by-category-loading">Loading…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-by-category-page">
        <div className="product-by-category-header">
          <h1 className="product-by-category-title">Products</h1>
          <p className="product-by-category-subtitle">{error}</p>
        </div>
        <div className="product-by-category-container">
          <div className="product-by-category-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-by-category-page">
      <div className="product-by-category-header">
        <h1 className="product-by-category-title">Products</h1>
        <p className="product-by-category-subtitle">
          Choose a category to browse variants
        </p>
      </div>

      <div className="product-by-category-container">
        {categories.length === 0 ? (
          <div className="product-by-category-empty">No categories found.</div>
        ) : (
          <div className="product-by-category-grid">
            {categories.map((cat) => {
              const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/products/${slug}`}
                  className="product-by-category-card-link"
                >
                  <div className="product-by-category-card">
                    <div className="product-by-category-image-wrapper">
                      <Image
                        src={getCategoryImage(cat)}
                        alt={cat.name || 'Category'}
                        className="product-by-category-image"
                        width={380}
                        height={300}
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 380px"
                      />
                      <div className="product-by-category-overlay">
                        <span className="product-by-category-card-category">
                          {(cat.name || 'Category').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="product-by-category-content">
                      <h3 className="product-by-category-card-title">{cat.name || 'Category'}</h3>
                      <p className="product-by-category-card-description">
                        {cat.description ? `${String(cat.description).slice(0, 120)}${cat.description.length > 120 ? '...' : ''}` : 'View variants'}
                      </p>
                      <span className="product-by-category-view-btn">View Variants</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
