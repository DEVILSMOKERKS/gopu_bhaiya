'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import './ProductByCategory.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';
const formatCategoryName = (value) =>
  String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Level 2: Variant listing at /products/:categorySlug
 * Fetches GET /api/products?category=categorySlug.
 * Each card links to /products/:categorySlug/:productSlug (Level 3).
 */
const ProductsByCategory = ({ categorySlug, backHref = '/products', productLinkBase }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [categoryDisplayName, setCategoryDisplayName] = useState('');
  const [categoryLookupDone, setCategoryLookupDone] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const base = productLinkBase || (categorySlug ? `/products/${categorySlug}` : '');

  useEffect(() => {
    if (!API_URL || categorySlug == null || categorySlug === '') {
      setCategoryLookupDone(true);
      setLoading(false);
      setError('Invalid category');
      return;
    }

    setLoading(true);
    setCategoryLookupDone(false);
    setError(null);
    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        const categoryData = res.data?.success && Array.isArray(res.data.data) ? res.data.data : [];
        const normalizedSlug = String(categorySlug).trim().toLowerCase();
        const matchedCategory = categoryData.find((category) => {
          const categorySlugValue = String(category.slug || '').trim().toLowerCase();
          const categoryNameSlug = String(category.name || '')
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

          return categorySlugValue === normalizedSlug || categoryNameSlug === normalizedSlug;
        });

        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
          setCategoryDisplayName(matchedCategory.name || formatCategoryName(categorySlug));
          setCategoryLookupDone(true);
          return;
        }

        setCategoryId(null);
        setCategoryDisplayName(formatCategoryName(categorySlug));
        setCategoryLookupDone(true);
      })
      .catch((err) => {
        setCategoryId(null);
        setCategoryDisplayName(formatCategoryName(categorySlug));
        setError(err.response?.data?.message || err.message || 'Failed to load category');
        setCategoryLookupDone(true);
      })
  }, [API_URL, categorySlug]);

  useEffect(() => {
    if (!API_URL || categorySlug == null || categorySlug === '' || !categoryLookupDone) {
      return;
    }

    setLoading(true);
    setError((previousError) => (
      previousError === 'Invalid category' ? previousError : null
    ));

    const request = categoryId != null
      ? axios.get(`${API_URL}/products/category/${categoryId}`, {
          params: { page: 1, limit: 100 },
        })
      : axios.get(`${API_URL}/products`, {
        params: { category: categorySlug, page: 1, limit: 100 },
      });

    request
      .then((res) => {
        const data = res.data?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
        if (data.length > 0 && data[0].category_name) {
          setCategoryDisplayName(data[0].category_name);
        } else {
          setCategoryDisplayName(formatCategoryName(categorySlug));
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL, categoryId, categoryLookupDone, categorySlug]);

  const getProductImage = (product) => {
    // Try colors first
    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      const firstColor = product.colors[0];
      let images = firstColor.images;
      
      // Handle different image formats
      if (!Array.isArray(images)) {
        images = firstColor.image_url ? [firstColor.image_url] : [];
      }
      
      if (images && images.length > 0) {
        const firstImage = images[0];
        let imagePath = '';
        
        if (typeof firstImage === 'string') {
          imagePath = firstImage;
        } else if (typeof firstImage === 'object' && firstImage !== null) {
          imagePath = firstImage.url || firstImage.image_url || firstImage.src || '';
        }
          
        if (imagePath) {
          const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
          const pathNormalized = String(imagePath).replace(/\\/g, '/');
          if (pathNormalized.startsWith('http')) {
            return pathNormalized;
          }
          const fullPath = pathNormalized.startsWith('/') ? pathNormalized : `/${pathNormalized}`;
          return baseUrl ? `${baseUrl}${fullPath}` : fullPath;
        }
      }
    }
    
    // Fallback to featured image
    if (product.featured_image) {
      const path = String(product.featured_image).replace(/\\/g, '/');
      const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
      if (path.startsWith('http')) {
        return path;
      }
      const fullPath = path.startsWith('/') ? path : `/${path}`;
      return baseUrl ? `${baseUrl}${fullPath}` : fullPath;
    }
    
    return PLACEHOLDER_IMAGE;
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

  const title = categoryDisplayName || formatCategoryName(categorySlug);
  return (
    <div className="product-by-category-page">
      <div className="product-by-category-header">
        <h1 className="product-by-category-title">{title}</h1>
        <p className="product-by-category-subtitle">
          Discover {products.length} thoughtfully crafted option{products.length !== 1 ? 's' : ''} in this collection.
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
                    {/* <div className="product-by-category-overlay">
                      <span className="product-by-category-card-category">
                        {(product.category_name || product.subcategory_name || 'Product').toUpperCase()}
                      </span>
                    </div> */}
                  </div>
                  <div className="product-by-category-content">
                    <h3 className="product-by-category-card-title">{product.name}</h3>
                    {/* <p className="product-by-category-card-description">
                      {product.description
                        ? `${String(product.description).replace(/<[^>]*>/g, '').slice(0, 120)}${product.description.length > 120 ? '...' : ''}`
                        : '—'}
                    </p> */}
                    <div className="product-by-category-meta">
                      <span className="product-by-category-price">
                        ₹{product.min_price ?? '—'} — ₹{product.max_price ?? '—'}
                      </span>
                    </div>
                    <span className="product-by-category-view-btn">View Details ...</span>
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
