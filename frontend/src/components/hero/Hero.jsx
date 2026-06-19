'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { HiSearch, HiX } from 'react-icons/hi';
import { useUser } from '../../context/UserContext';
import { getProductPriceRangeText } from '../../Utils/productPrice';
import './hero.css';

// Define image URLs solely for rotation count and for reference in CSS
const desktopImageUrls = [
  "https://ik.imagekit.io/adsrc2244/mateshwarimoortibhandar/main-page/sdg%202.jpg?updatedAt=1761543215591",
  "https://ik.imagekit.io/adsrc2244/mateshwarimoortibhandar/main-page/banner2.jpg?updatedAt=1759853802517",
];
const heroImages = desktopImageUrls; // Use desktop array length for rotation count

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Debounced search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(`${API_URL}/products?search=${encodeURIComponent(query)}&limit=8`);

      if (response.data.success) {
        setSearchResults(response.data.data);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Handle search result click
  const handleSearchResultClick = (product) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setIsSearchOpen(false);
    router.push(`/product/${product.product_id}`);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearchOpen(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.getElementById('hero-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0) {
      return `${API_URL.replace('/api', '')}${product.colors[0].images[0]}`;
    }
    return '/placeholder-product.jpg';
  };

  return (
    <>
      <section className="hero">
        {/* Background with hero image - NOW A DIV CONTROLLED BY CSS */}
        <div className="hero-background">
          <div
            // Use a class to indicate the current image index for CSS selection
            className={`hero-bg-image hero-bg-image--${currentImageIndex + 1}`}
          >
            <div className="hero-overlay"></div>
          </div>
        </div>

        {/* Right Edge Scroll Dots */}
        <div className="hero-scroll-dots">
          {heroImages.map((_, index) => (
            <div
              key={index}
              className={`hero-dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* Hero Search Container */}
      <div className={`hero-search-container ${isSearchOpen ? 'open' : ''}`} ref={searchContainerRef}>
        <form onSubmit={handleSearchSubmit} className="hero-search-form">
          <div className="hero-search-input-wrapper">
            <HiSearch className="hero-search-icon" />
            <input
              id="hero-search-input"
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="hero-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="hero-clear-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
              >
                <HiX className="hero-clear-icon" />
              </button>
            )}
          </div>
        </form>

        {/* Search Results */}
        {showSearchResults && (
          <div className="hero-search-results">
            {isSearching ? (
              <div className="hero-search-loading">
                <div className="hero-search-spinner"></div>
                <span>Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="hero-search-results-list">
                {searchResults.map((product) => (
                  <div
                    key={product.product_id}
                    className="hero-search-result-item"
                    onClick={() => handleSearchResultClick(product)}
                  >
                    <div className="hero-search-result-image">
                      <Image src={getProductImage(product)} alt={product.name} width={80} height={80} style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="hero-search-result-content">
                      <h4 className="hero-search-result-title">{product.name}</h4>
                      <p className="hero-search-result-category">
                        {product.category_name} {product.subcategory_name && `> ${product.subcategory_name}`}
                      </p>
                      <p className="hero-search-result-price">
                        {getProductPriceRangeText(product)}
                      </p>
                    </div>
                  </div>
                ))}
                {searchResults.length >= 8 && (
                  <div className="hero-search-view-all">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="hero-search-view-all-btn"
                    >
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </div>
                )}
              </div>
            ) : searchQuery.trim() && (
              <div className="hero-search-no-results">
                <span>No products found for &quot;{searchQuery}&quot;</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blur Overlay for Content */}
      {isSearchOpen && <div className="hero-content-blur-overlay" onClick={toggleSearch}></div>}
    </>
  );
};

export default Hero;
