import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiSearch } from 'react-icons/hi';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import { useUser } from '../../context/UserContext';
import './header.css';
import logo from '../../assets/img/logo.png'
// import MegaMenu from './MegaMenu' // Commented for future use

const Header = ({ onAccountClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [activeMegaMenu, setActiveMegaMenu] = useState(null); // Commented for future use
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { cart, wishlist } = useWishlistCart();
  const { user, isAuthenticated } = useUser();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Get API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

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

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
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
    navigate(`/product/${product.product_id}`);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
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

  // const handleMouseEnter = (category) => {
  //   setActiveMegaMenu(category);
  // };

  // const handleMouseLeave = () => {
  //   setActiveMegaMenu(null);
  // };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on search input when opening
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
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
      navigate('/profile');
    } else {
      navigate('/login');
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
      <header className="header">
        <div className="header-container">
          {/* Mobile Hamburger Menu */}
          <div className="header-mobile-menu-toggle">
            <button
              className="header-hamburger-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="header-hamburger-icon header-close-icon" />
              ) : (
                <HiMenu className="header-hamburger-icon" />
              )}
            </button>
          </div>

          {/* Logo/Brand Section */}
          <div className="header-brand-section">
            <Link to="/" onClick={closeMobileMenu}>
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="header-navigation header-desktop-nav">
            <ul className="header-nav-links">
              <li>
                <Link to="/" className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                  HOME
                </Link>
              </li>
              <li className="header-nav-item">
                <Link to="/shop?collection=women" className="header-nav-link">WOMEN</Link>
              </li>
              <li className="header-nav-item">
                <Link to="/shop?collection=coord-set" className="header-nav-link">Coord Set</Link>
              </li>
              <li className="header-nav-item">
                <Link to="/shop?collection=kurti" className="header-nav-link">Kurti</Link>
              </li>
              <li className="header-nav-item">
                <Link to="/shop?collection=shirts" className="header-nav-link">Shirts</Link>
              </li>
            </ul>
          </nav>

          {/* Icons Section */}
          <div className="header-icons-section">
            <button className="header-icon-btn" onClick={toggleSearch}>
              {isSearchOpen ? (
                <HiX className="header-icon" />
              ) : (
                <HiSearch className="header-icon" />
              )}
            </button>
            <button className="header-icon-btn" onClick={handleAccountClick}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <Link to="/wishlist">
              <button className="header-icon-btn header-wishlist-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlist.total_items > 0 && (
                  <span className="header-badge header-wishlist-badge">{wishlist.total_items}</span>
                )}
              </button>
            </Link>
            <Link to="/cart">
              <button className="header-icon-btn header-cart-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cart.summary.total_items > 0 && (
                  <span className="header-badge header-cart-badge">{cart.summary.total_items}</span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`header-search-container ${isSearchOpen ? 'open' : ''}`} ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <div className="header-search-input-wrapper">
              <HiSearch className="header-search-icon" />
              <input
                id="search-input"
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="header-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="header-clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                >
                  <HiX className="header-clear-icon" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results */}
          {showSearchResults && (
            <div className="header-search-results">
              {isSearching ? (
                <div className="header-search-loading">
                  <div className="header-search-spinner"></div>
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="header-search-results-list">
                  {searchResults.map((product) => (
                    <div
                      key={product.product_id}
                      className="header-search-result-item"
                      onClick={() => handleSearchResultClick(product)}
                    >
                      <div className="header-search-result-image">
                        <img src={getProductImage(product)} alt={product.name} />
                      </div>
                      <div className="header-search-result-content">
                        <h4 className="header-search-result-title">{product.name}</h4>
                        <p className="header-search-result-category">
                          {product.category_name} {product.subcategory_name && `> ${product.subcategory_name}`}
                        </p>
                        <p className="header-search-result-price">
                          ₹{product.min_price} - ₹{product.max_price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {searchResults.length >= 8 && (
                    <div className="header-search-view-all">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="header-search-view-all-btn"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              ) : searchQuery.trim() && (
                <div className="header-search-no-results">
                  <span>No products found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className={`header-mobile-menu-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Mobile Navigation Menu */}
        <div className={`header-mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Menu Header with Logo and Close Button */}
          <div className="header-mobile-menu-header">
            <div className="header-mobile-logo">
              <img src={logo} alt="Mateshwari Moorti Bhandar" />
            </div>
            <button
              className="header-mobile-close-btn"
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <HiX className="header-mobile-close-icon" />
            </button>
          </div>

          <nav className="header-mobile-navigation">
            <ul className="header-mobile-nav-links">
              <li>
                <Link to="/" className={`header-mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=women" className="header-mobile-nav-link" onClick={closeMobileMenu}>WOMEN</Link>
              </li>
              <li>
                <Link to="/shop?collection=coord-set" className="header-mobile-nav-link" onClick={closeMobileMenu}>Coord Set</Link>
              </li>
              <li>
                <Link to="/shop?collection=kurti" className="header-mobile-nav-link" onClick={closeMobileMenu}>Kurti</Link>
              </li>
              <li>
                <Link to="/shop?collection=shirts" className="header-mobile-nav-link" onClick={closeMobileMenu}>Shirts</Link>
              </li>
            </ul>

            {/* Follow Us Section */}
            <div className="header-mobile-follow-section">
              <h3 className="header-mobile-follow-title">FOLLOW US</h3>
              <div className="header-mobile-social-links">
                <a
                  href="https://www.instagram.com/saanzjaipur?igsh=MXY0eThwMzI0NDkwcQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-mobile-social-link"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1EyGdAjHEf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-mobile-social-link"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Mega Menu - Commented for future use */}
        {/* {activeMegaMenu && (
          <MegaMenu
            activeCategory={activeMegaMenu}
            className={`megamenu-mega-menu show`}
          />
        )} */}
      </header>

      {/* Blur Overlay for Content */}
      {isSearchOpen && <div className="header-content-blur-overlay" onClick={toggleSearch}></div>}
    </>
  );
};

export default Header;
