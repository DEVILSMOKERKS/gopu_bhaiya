'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import './ProductByCategory.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';

/**
 * Level 2: Variant listing at /products/:categorySlug
 * Fetches GET /api/products?category=categorySlug.
 * Each card links to /products/:categorySlug/:productSlug (Level 3).
 */
const ProductsByCategory = ({ categorySlug, backHref = '/products', productLinkBase }) => {
  const [categoryDisplayName, setCategoryDisplayName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const base = productLinkBase || (categorySlug ? `/products/${categorySlug}` : '');

  useEffect(() => {
    if (!API_URL || categorySlug == null || categorySlug === '') {
      setLoading(false);
      setError('Invalid category');
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/products`, {
        params: { category: categorySlug, page: 1, limit: 100 },
        headers: { 'Cache-Control': 'no-cache' },
      })
      .then((res) => {
        const data = res.data?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
        if (data.length > 0 && data[0].category_name) {
          setCategoryDisplayName(data[0].category_name);
        } else {
          setCategoryDisplayName(
            String(categorySlug).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          );
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL, categorySlug]);

  const getProductImage = (product) => {
    if (!product.colors || product.colors.length === 0) {
      if (product.featured_image) {
        const path = String(product.featured_image).replace(/\\/g, '/');
        const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
        return path.startsWith('http') ? path : `${baseUrl || ''}${path.startsWith('/') ? '' : '/'}${path}`;
      }
      return PLACEHOLDER_IMAGE;
    }
    const firstColor = product.colors[0];
    const images = firstColor.images ?? (firstColor.image_url ? [firstColor.image_url] : []);
    const firstImage = Array.isArray(images) ? images[0] : images;
    if (!firstImage) {
      if (product.featured_image) {
        const path = String(product.featured_image).replace(/\\/g, '/');
        const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
        return path.startsWith('http') ? path : `${baseUrl || ''}${path.startsWith('/') ? '' : '/'}${path}`;
      }
      return PLACEHOLDER_IMAGE;
    }
    const path = typeof firstImage === 'string' ? firstImage : firstImage?.url || firstImage?.image_url || '';
    if (!path) return PLACEHOLDER_IMAGE;
    const pathNormalized = path.replace(/\\/g, '/');
    const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
    const normalized = pathNormalized.startsWith('http') ? pathNormalized : `${pathNormalized.startsWith('/') ? '' : '/'}${pathNormalized}`;
    return baseUrl ? `${baseUrl}${normalized}` : normalized;
  };

  const getProductHref = (product) => {
    const slug = product.slug || `product-${product.product_id}`;
    return `${base}/${slug}`;
  };

  if (loading) {
    return (
      <div className="product-by-category-page">
        <div className="product-by-category-header">
          <h1 className="product-by-category-title">Category</h1>
          <p className="product-by-category-subtitle">Loading…</p>
        </div>
        <div className="product-by-category-container">
          <div className="product-by-category-loading">Loading variants…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-by-category-page">
        <div className="product-by-category-header">
          <h1 className="product-by-category-title">Category</h1>
          <p className="product-by-category-subtitle">{error}</p>
        </div>
        <div className="product-by-category-container">
          <div className="product-by-category-error">{error}</div>
          <Link href={backHref} className="product-by-category-back">
            ← Back to categories
          </Link>
        </div>
      </div>
    );
  }

  const title = categoryDisplayName || String(categorySlug).replace(/-/g, ' ');
  return (
    <div className="product-by-category-page">
      <div className="product-by-category-header">
        <h1 className="product-by-category-title">{title}</h1>
        <p className="product-by-category-subtitle">
          {products.length} variant{products.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      <div className="product-by-category-container">
        <Link href={backHref} className="product-by-category-back product-by-category-back-top">
          ← All categories
        </Link>

        {products.length === 0 ? (
          <div className="product-by-category-empty">No variants found in this category.</div>
        ) : (
          <div className="product-by-category-grid">
            {products.map((product) => (
              <Link
                key={product.product_id}
                href={getProductHref(product)}
                className="product-by-category-card-link"
              >
                <div className="product-by-category-card">
                  <div className="product-by-category-image-wrapper">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name || 'Product'}
                      className="product-by-category-image"
                      width={380}
                      height={300}
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                    <div className="product-by-category-overlay">
                      <span className="product-by-category-card-category">
                        {(product.category_name || product.subcategory_name || 'Product').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="product-by-category-content">
                    <h3 className="product-by-category-card-title">{product.name}</h3>
                    <p className="product-by-category-card-description">
                      {product.description
                        ? `${String(product.description).replace(/<[^>]*>/g, '').slice(0, 120)}${product.description.length > 120 ? '...' : ''}`
                        : '—'}
                    </p>
                    <div className="product-by-category-meta">
                      <span className="product-by-category-price">
                        ₹{product.min_price ?? '—'} — ₹{product.max_price ?? '—'}
                      </span>
                    </div>
                    <span className="product-by-category-view-btn">View Details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;
