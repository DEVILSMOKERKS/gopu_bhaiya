import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiSearch } from 'react-icons/hi';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import { useUser } from '../../context/UserContext';
import './header.css';
import logo from '../../assets/img/logo.png'

const Header = ({ onAccountClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
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
        const searchInput = document.getElementById('search-input') || document.getElementById('search-input-other');
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
      <header className={`header ${isHomePage ? 'header-home' : 'header-other'}`}>
        {/* Home Page Header */}
        {isHomePage ? (
          <>
            {/* Top Bar - Search, Logo, BULK ORDER */}
            <div className="header-top-bar">
              <div className="header-top-left">
                <div className="header-search-bar-home" ref={searchContainerRef}>
                  <form onSubmit={handleSearchSubmit} className="header-search-form-home">
                    <HiSearch className="header-search-icon-home" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="header-search-input-home"
                    />
                  </form>
                  {showSearchResults && (
                    <div className="header-search-results-home">
                      {isSearching ? (
                        <div className="header-search-loading">Searching...</div>
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
                                <p className="header-search-result-price">
                                  ₹{product.min_price} - ₹{product.max_price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
              <div className="header-top-center">
                <Link to="/" className="header-logo-link">
                  <img src={logo} alt="Mateshwari Exports" className="header-logo-img" />
                </Link>
              </div>
              <div className="header-top-right">
                <button className="header-bulk-order-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  BULK ORDER
                </button>
              </div>
            </div>
            {/* Navigation Bar */}
            <nav className="header-nav-bar-home">
              <ul className="header-nav-links-home">
                <li>
                  <Link to="/" className={`header-nav-link-home ${location.pathname === '/' ? 'active' : ''}`}>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/About-us" className="header-nav-link-home">ABOUT US</Link>
                </li>
                <li>
                  <Link to="/shop" className="header-nav-link-home">ALL PRODUCT</Link>
                </li>
                <li>
                  <Link to="/how-to-place-order" className="header-nav-link-home">HOW TO PLACE ORDER</Link>
                </li>
                <li>
                  <Link to="/contact-us" className="header-nav-link-home">CONTACT US</Link>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          /* Other Pages Header */
          <div className="header-container-other">
            {/* Logo Left */}
            <div className="header-brand-section-other">
              <Link to="/" onClick={closeMobileMenu}>
                <img src={logo} alt="Mateshwari Exports" className="header-logo-img-other" />
              </Link>
            </div>

            {/* Navigation Center */}
            <nav className="header-navigation-other">
              <ul className="header-nav-links-other">
                <li>
                  <Link to="/" className={`header-nav-link-other ${location.pathname === '/' ? 'active' : ''}`}>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/About-us" className={`header-nav-link-other ${location.pathname === '/About-us' ? 'active' : ''}`}>ABOUT US</Link>
                </li>
                <li>
                  <Link to="/shop" className={`header-nav-link-other ${location.pathname === '/shop' || location.pathname.startsWith('/product') ? 'active' : ''}`}>ALL PRODUCT</Link>
                </li>
                <li>
                  <Link to="/how-to-place-order" className={`header-nav-link-other ${location.pathname === '/how-to-place-order' ? 'active' : ''}`}>HOW TO PLACE ORDER</Link>
                </li>
                <li>
                  <Link to="/contact-us" className={`header-nav-link-other ${location.pathname === '/contact-us' ? 'active' : ''}`}>CONTACT US</Link>
                </li>
              </ul>
            </nav>

            {/* Right Section - BULK ORDER and Search */}
            <div className="header-right-section-other">
              <button className="header-bulk-order-btn-other">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                BULK ORDER
              </button>
              <div className="header-search-icon-other" onClick={toggleSearch}>
                <HiSearch className="header-search-icon" />
              </div>
            </div>

            {/* Search Bar - Toggleable */}
            {isSearchOpen && (
              <div className="header-search-bar-other" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit} className="header-search-form-other">
                  <HiSearch className="header-search-icon-other-input" />
                  <input
                    id="search-input-other"
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="header-search-input-other"
                    autoFocus
                  />
                </form>
                {showSearchResults && (
                  <div className="header-search-results-other">
                    {isSearching ? (
                      <div className="header-search-loading">Searching...</div>
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
                              <p className="header-search-result-price">
                                ₹{product.min_price} - ₹{product.max_price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Header - For all pages */}
        <div className="header-mobile-home">
          <button
            className="header-mobile-hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <HiMenu className="header-mobile-hamburger-icon" />
          </button>
          <Link to="/" className="header-mobile-logo-link">
            <img src={logo} alt="Mateshwari Exports" className="header-mobile-logo-img" />
          </Link>
          <div className="header-mobile-social-icons">
            <a
              href="https://www.instagram.com/mateshwari_exports/"
              target="_blank"
              rel="noopener noreferrer"
              className="header-mobile-social-icon-link"
            >
              <FaInstagram className="header-mobile-social-icon" />
            </a>
            <a
              href="https://www.facebook.com/mateshwariexports/"
              target="_blank"
              rel="noopener noreferrer"
              className="header-mobile-social-icon-link"
            >
              <FaFacebook className="header-mobile-social-icon" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="header-mobile-social-icon-link"
            >
              <FaYoutube className="header-mobile-social-icon" />
            </a>
          </div>
        </div>

        {/* Mobile Menu for all pages */}
        {isMobileMenuOpen && (
          <div
            className={`header-mobile-menu-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={closeMobileMenu}
          ></div>
        )}
        <div className={`header-mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="header-mobile-menu-header">
            <div className="header-mobile-logo">
              <img src={logo} alt="Mateshwari Exports" />
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
                <Link to="/About-us" className="header-mobile-nav-link" onClick={closeMobileMenu}>ABOUT US</Link>
              </li>
              <li>
                <Link to="/shop" className="header-mobile-nav-link" onClick={closeMobileMenu}>ALL PRODUCT</Link>
              </li>
              <li>
                <Link to="/how-to-place-order" className="header-mobile-nav-link" onClick={closeMobileMenu}>HOW TO PLACE ORDER</Link>
              </li>
              <li>
                <Link to="/contact-us" className="header-mobile-nav-link" onClick={closeMobileMenu}>CONTACT US</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
