'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const [products, setProducts] = useState([]);
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
    Promise.all([
      axios.get(`${API_URL}/categories`),
      axios.get(`${API_URL}/products`, {
        params: { page: 1, limit: 1000 },
      }),
    ])
      .then(([categoryRes, productRes]) => {
        const categoryData = categoryRes.data?.success && Array.isArray(categoryRes.data.data)
          ? categoryRes.data.data
          : [];
        const productData = Array.isArray(productRes.data?.data) ? productRes.data.data : [];

        setCategories(categoryData.filter((c) => c.status !== 'inactive'));
        setProducts(productData.filter((product) => product.category_id != null));
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load categories');
        setCategories([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL]);

  const visibleCategories = useMemo(() => {
    const byCategoryId = new Map();

    products.forEach((product) => {
      if (product.category_id == null) return;

      const existingCategory = categories.find((category) => category.id === product.category_id);
      const fallbackName = product.category_name || 'Category';
      const fallbackSlug = fallbackName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

      if (!byCategoryId.has(product.category_id)) {
        byCategoryId.set(product.category_id, {
          id: product.category_id,
          name: existingCategory?.name || fallbackName,
          slug: existingCategory?.slug || product.category_slug || fallbackSlug || String(product.category_id),
          description: existingCategory?.description || '',
          image_url: existingCategory?.image_url || product.featured_image || null,
        });
      }
    });

    return Array.from(byCategoryId.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [categories, products]);

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
          Browse handcrafted collections by category and discover designs that suit your home, temple, or gifting needs.
        </p>
      </div>

      <div className="product-by-category-container">
        {visibleCategories.length === 0 ? (
          <div className="product-by-category-empty">No categories found.</div>
        ) : (
          <div className="product-by-category-grid">
            {visibleCategories.map((cat) => {
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
                      {/* <div className="product-by-category-overlay">
                        <span className="product-by-category-card-category">
                          {(cat.name || 'Category').toUpperCase()}
                        </span>
                      </div> */}
                    </div>
                    <div className="product-by-category-content">
                      <h3 className="product-by-category-card-title">{cat.name || 'Category'}</h3>
                      {/* <p className="product-by-category-card-description">
                        {cat.description ? `${String(cat.description).slice(0, 120)}${cat.description.length > 120 ? '...' : ''}` : 'View variants'}
                      </p> */}
                      <span className="product-by-category-view-btn">View More...</span>
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
