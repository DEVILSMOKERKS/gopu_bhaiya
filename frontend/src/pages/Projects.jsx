'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import './Projects.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/products`, {
          params: { page: 1, limit: 100 },
          headers: { 'Cache-Control': 'no-cache' },
        });
        const data = response.data?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Projects fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (API_URL) {
      fetchProducts();
    } else {
      setError('API URL not configured');
      setLoading(false);
    }
  }, [API_URL]);

  // Build category list from products (category_name, subcategory_name) + "all"
  const categories = useMemo(() => {
    const set = new Set(['all']);
    products.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
      if (p.subcategory_name) set.add(p.subcategory_name);
    });
    return ['all', ...[...set].filter((c) => c !== 'all').sort()];
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    return products.filter(
      (p) => p.category_name === activeFilter || p.subcategory_name === activeFilter
    );
  }, [products, activeFilter]);

  // Get product image URL (first color's first image from backend)
  const getProductImage = (product) => {
    if (!product.colors || product.colors.length === 0) return PLACEHOLDER_IMAGE;
    const firstColor = product.colors[0];
    const images = firstColor.images ?? (firstColor.image_url ? [firstColor.image_url] : []);
    const firstImage = Array.isArray(images) ? images[0] : images;
    if (!firstImage) return PLACEHOLDER_IMAGE;
    const path = typeof firstImage === 'string' ? firstImage : firstImage?.url || firstImage?.image_url || '';
    if (!path) return PLACEHOLDER_IMAGE;
    // Normalize path: use forward slashes (backend may return backslashes on Windows)
    const pathNormalized = path.replace(/\\/g, '/');
    const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
    const normalized = pathNormalized.startsWith('http') ? pathNormalized : `${pathNormalized.startsWith('/') ? '' : '/'}${pathNormalized}`;
    return baseUrl ? `${baseUrl}${normalized}` : normalized;
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="projects-header">
          <h1 className="projects-title h2style">Products</h1>
          <p className="projects-subtitle">
            Explore our products from the database
          </p>
        </div>
        <div className="projects-container">
          <div className="projects-loading">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="projects-header">
          <h1 className="projects-title h2style">Products</h1>
          <p className="projects-subtitle">
            Explore our products from the database
          </p>
        </div>
        <div className="projects-container">
          <div className="projects-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="projects-title h2style">Products</h1>
        <p className="projects-subtitle">
          Explore our products showcasing excellence in design and craftsmanship
        </p>
      </div>

      <div className="projects-container">
        {categories.length > 1 && (
          <div className="projects-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="projects-empty">No products found.</div>
        ) : (
          <div className="projects-grid">
            {filteredProducts.map((product) => (
              <div key={product.product_id} className="project-card">
                <div className="project-image-wrapper">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name || 'Product'}
                    className="project-image"
                    width={380}
                    height={300}
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="project-overlay">
                    <span className="project-category">
                      {(product.category_name || product.subcategory_name || 'Product').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{product.name}</h3>
                  <p className="project-description">
                    {product.description
                      ? `${product.description.slice(0, 120)}${product.description.length > 120 ? '...' : ''}`
                      : '—'}
                  </p>
                  <div className="project-meta">
                    <span className="project-price">
                      ₹{product.min_price ?? '—'} — ₹{product.max_price ?? '—'}
                    </span>
                  </div>
                  <Link
                    href={`/product/${product.product_id}`}
                    className="project-view-btn"
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

export default Projects;
