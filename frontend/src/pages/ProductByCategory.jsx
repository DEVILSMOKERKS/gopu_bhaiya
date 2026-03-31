'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import './ProductByCategory.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';

const ProductByCategory = ({ categoryIdOrSlug }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Resolve categoryIdOrSlug to numeric category_id (and optional category name)
  useEffect(() => {
    if (!API_URL || !categoryIdOrSlug) {
      setLoading(false);
      setError('Invalid category');
      return;
    }

    const numericId = parseInt(categoryIdOrSlug, 10);
    if (!Number.isNaN(numericId)) {
      setCategoryId(numericId);
      return;
    }

    // Treat as slug: fetch categories and find id
    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const slug = String(categoryIdOrSlug).toLowerCase();
          const cat = res.data.data.find(
            (c) => c.slug && c.slug.toLowerCase() === slug
          );
          if (cat) {
            setCategoryId(cat.id);
            setCategoryName(cat.name || '');
          } else {
            setError('Category not found');
            setLoading(false);
          }
        } else {
          setError('Category not found');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Failed to load category');
        setLoading(false);
      });
  }, [API_URL, categoryIdOrSlug]);

  // Fetch products by category_id
  useEffect(() => {
    if (!API_URL || categoryId == null) return;
    if (error) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/products/category/${categoryId}`, {
        params: { page: 1, limit: 100 },
      })
      .then((res) => {
        const data = res.data?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
        if (!categoryName && data.length > 0 && data[0].category_name) {
          setCategoryName(data[0].category_name);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL, categoryId, categoryName]);

  const getProductImage = (product) => {
    if (!product.colors || product.colors.length === 0) {
      if (product.featured_image) {
        const path = product.featured_image.replace(/\\/g, '/');
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
        const path = product.featured_image.replace(/\\/g, '/');
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

  if (loading && products.length === 0) {
    return (
      <div className="product-by-category-page">
        <div className="product-by-category-header">
          <h1 className="product-by-category-title">Products</h1>
          <p className="product-by-category-subtitle">Loading…</p>
        </div>
        <div className="product-by-category-container">
          <div className="product-by-category-loading">Loading products…</div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="product-by-category-page">
        <div className="product-by-category-header">
          <h1 className="product-by-category-title">Category</h1>
          <p className="product-by-category-subtitle">{error}</p>
        </div>
        <div className="product-by-category-container">
          <div className="product-by-category-error">{error}</div>
          <Link href="/projects" className="product-by-category-back">
            ← Back to all products
          </Link>
        </div>
      </div>
    );
  }

  const title = categoryName || 'Products';
  return (
    <div className="\+">
      <div className="product-by-category-header">
        <h1 className="product-by-category-title">{title}</h1>
        <p className="product-by-category-subtitle">
          {products.length} product{products.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      <div className="product-by-category-container">
        <Link href="/projects" className="product-by-category-back product-by-category-back-top">
          ← All products
        </Link>

        {products.length === 0 ? (
          <div className="product-by-category-empty">No products found in this category.</div>
        ) : (
          <div className="product-by-category-grid">
            {products.map((product) => (
              <div key={product.product_id} className="product-by-category-card">
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
                      ? `${product.description.replace(/<[^>]*>/g, '').slice(0, 120)}${product.description.length > 120 ? '...' : ''}`
                      : '—'}
                  </p> */}
                  <div className="product-by-category-meta">
                    <span className="product-by-category-price">
                      ₹{product.min_price ?? '—'} — ₹{product.max_price ?? '—'}
                    </span>
                  </div>
                  <Link
                    href={`/product/${product.product_id}`}
                    className="product-by-category-view-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductByCategory;
