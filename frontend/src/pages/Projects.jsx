'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getProductPriceRangeText } from '../Utils/productPrice';
import './Projects.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';

const Projects = () => {
  const pathname = usePathname();
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

  // Build category list from products with id, name, slug (link to /category/:slug)
  const categoryList = useMemo(() => {
    const byId = new Map();
    products.forEach((p) => {
      if (p.category_id != null && p.category_name) {
        const slug = p.category_slug || p.category_name.toLowerCase().replace(/\s+/g, '-');
        byId.set(p.category_id, { id: p.category_id, name: p.category_name, slug });
      }
    });
    return [{ id: 'all', name: 'All Products', slug: null }, ...Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name))];
  }, [products]);

  // Filter products by selected category (only when staying on this page with "all" or legacy filter)
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    return products.filter(
      (p) => p.category_id === activeFilter || p.category_name === activeFilter || p.subcategory_name === activeFilter
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
        {categoryList.length > 1 && (
          <div className="projects-filters">
            {categoryList.map((cat) =>
              cat.id === 'all' ? (
                <Link
                  key="all"
                  href="/projects"
                  className={`filter-btn ${pathname === '/projects' ? 'active' : ''}`}
                >
                  All Products
                </Link>
              ) : (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`filter-btn ${pathname === `/category/${cat.slug}` ? 'active' : ''}`}
                >
                  {cat.name}
                </Link>
              )
            )}
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
                      {getProductPriceRangeText(product, 'Price not available')}
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
