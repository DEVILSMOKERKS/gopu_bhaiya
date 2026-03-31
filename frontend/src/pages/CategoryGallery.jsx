'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import './ProductByCategory.css';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';

const CategoryGallery = ({ categoryName: categorySlugOrId }) => {
  const [categoryDisplayName, setCategoryDisplayName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!API_URL || categorySlugOrId == null || categorySlugOrId === '') {
      setLoading(false);
      setError('Invalid category');
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/products`, {
        params: { category: categorySlugOrId, page: 1, limit: 100 },
      })
      .then((res) => {
        const data = res.data?.data ?? [];
        setProducts(Array.isArray(data) ? data : []);
        if (data.length > 0 && data[0].category_name) {
          setCategoryDisplayName(data[0].category_name);
        } else {
          setCategoryDisplayName(
            String(categorySlugOrId).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          );
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL, categorySlugOrId]);

  // Helper to normalize paths
  const normalizePath = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    const cleanPath = String(path).replace(/\\/g, '/');
    const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
    return cleanPath.startsWith('http') ? cleanPath : `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  const getProductImage = (product) => {
    if (product.featured_image) return normalizePath(product.featured_image);
    if (product.colors && product.colors.length > 0) {
      const firstImg = product.colors[0].images?.[0] || product.colors[0].image_url;
      if (firstImg) return normalizePath(firstImg);
    }
    return PLACEHOLDER_IMAGE;
  };

  if (loading) { /* Same loading state */ }
  if (error) { /* Same error state */ }

  return (
    <div className="product-by-category-page">
      <div className="product-by-category-header">
        <h1 className="product-by-category-title">{categoryDisplayName || 'Category'}</h1>
        <p className="product-by-category-subtitle">{products.length} items available</p>
      </div>

      <div className="product-by-category-container">
        <div className="product-by-category-grid">
          {products.map((product) => (
            <Link
              key={product.product_id}
              href={product.category_slug && product.slug ? `/products/${product.category_slug}/${product.slug}` : `/product/${product.product_id}`}
              className="product-by-category-card-link"
            >
              <div className="product-by-category-card">
                {/* Main Image */}
                <div className="product-by-category-image-wrapper">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-by-category-image"
                    width={380}
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Content Section */}
                <div className="product-by-category-content">
                  <span className="view-more-text">VIEW MORE...</span>
                  <h3 className="product-by-category-card-title">
                    {product.name?.toUpperCase()} VARIATIONS
                  </h3>

                  {/* Thumbnail Grid - 3 Columns */}
                  <div className="product-variations-grid">
                    {product.colors && product.colors.slice(0, 6).map((color, idx) => {
                      const thumbImg = color.images?.[0] || color.image_url;
                      return (
                        <div key={idx} className="variation-thumbnail-box">
                          <Image
                            src={normalizePath(thumbImg)}
                            alt="variation"
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="product-by-category-meta">
                    <span className="product-by-category-price">
                      ₹{product.min_price} — ₹{product.max_price}
                    </span>
                  </div>
                  <span className="product-by-category-view-btn">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGallery;
