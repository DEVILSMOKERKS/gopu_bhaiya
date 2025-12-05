'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiX, HiSearch } from 'react-icons/hi';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import { useUser } from '../../context/UserContext';
import HomeMegaMenu from './HomeMegaMenu';
import './header.css';
import logo from '../../assets/img/logo.png'
import { getApiUrl } from '../../utils/env';

const Header = ({ onAccountClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  // const [activeMegaMenu, setActiveMegaMenu] = useState(null); // Commented for future use
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomeMegaMenuOpen, setIsHomeMegaMenuOpen] = useState(false);
  const { cart, wishlist } = useWishlistCart();
  const { user, isAuthenticated } = useUser();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const homeMenuTimeoutRef = useRef(null);

  // Handle scroll event to change header background
  useEffect(() => {
    // On non-home pages, header should start as scrolled (white background)
    if (!isHomePage) {
      setIsScrolled(true);
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (homeMenuTimeoutRef.current) {
        clearTimeout(homeMenuTimeoutRef.current);
      }
    };
  }, [isHomePage]);

  // Get API URL from environment variable
  const API_URL = getApiUrl();

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
    router.push(`/product/${product.product_id}`);
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
      <header className={`header ${isScrolled ? 'header-scrolled' : 'header-transparent'}`}>
        {/* Unified Header Structure for All Pages */}
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
                            <Image src={getProductImage(product)} alt={product.name} width={100} height={100} />
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
            <Link href="/" className="header-logo-link">
              <Image src={logo} alt="Mateshwari Exports" className="header-logo-img" width={150} height={50} priority />
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
        {/* Navigation Bar - Same for All Pages */}
        <nav className="header-nav-bar-home">
          <ul className="header-nav-links-home">
            <li
              className="header-nav-item-home"
              onMouseEnter={() => {
                clearTimeout(homeMenuTimeoutRef.current);
                setIsHomeMegaMenuOpen(true);
              }}
              onMouseLeave={() => {
                homeMenuTimeoutRef.current = setTimeout(() => {
                  setIsHomeMegaMenuOpen(false);
                }, 200);
              }}
            >
              <Link href="/" className={`header-nav-link-home ${pathname === '/' ? 'active' : ''}`}>
                HOME
              </Link>
              <HomeMegaMenu
                isOpen={isHomeMegaMenuOpen}
                onMouseLeave={() => {
                  homeMenuTimeoutRef.current = setTimeout(() => {
                    setIsHomeMegaMenuOpen(false);
                  }, 200);
                }}
              />
            </li>
            <li>
              <Link href="/projects" className={`header-nav-link-home ${pathname === '/projects' ? 'active' : ''}`}>PROJECTS</Link>
            </li>
            <li>
              <Link href="/our-creations" className={`header-nav-link-home ${pathname === '/our-creations' ? 'active' : ''}`}>OUR CREATIONS</Link>
            </li>
            <li>
              <Link href="/our-services" className={`header-nav-link-home ${pathname === '/our-services' ? 'active' : ''}`}>OUR SERVICES</Link>
            </li>
            <li>
              <Link href="/how-to-place-order" className={`header-nav-link-home ${pathname === '/how-to-place-order' ? 'active' : ''}`}>HOW IT WORKS</Link>
            </li>
            <li>
              <Link href="/blogs" className={`header-nav-link-home ${pathname === '/blogs' || pathname?.startsWith('/blog/') ? 'active' : ''}`}>BLOG</Link>
            </li>
            <li>
              <Link href="/book-appointment" className={`header-nav-link-home ${pathname === '/book-appointment' ? 'active' : ''}`}>BOOK APPOINTMENT</Link>
            </li>
            <li>
              <Link href="/testimonials" className={`header-nav-link-home ${pathname === '/testimonials' ? 'active' : ''}`}>TESTIMONIALS</Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Header - For all pages */}
        <div className="header-mobile-home">
          <button
            className="header-mobile-hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <HiMenu className="header-mobile-hamburger-icon" />
          </button>
          <Link href="/" className="header-mobile-logo-link">
            <Image src={logo} alt="Mateshwari Exports" className="header-mobile-logo-img" width={150} height={50} priority />
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
              <Image src={logo} alt="Mateshwari Exports" width={150} height={50} priority />
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
                <Link href="/" className={`header-mobile-nav-link ${pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/projects" className={`header-mobile-nav-link ${pathname === '/projects' ? 'active' : ''}`} onClick={closeMobileMenu}>PROJECTS</Link>
              </li>
              <li>
                <Link href="/our-creations" className={`header-mobile-nav-link ${pathname === '/our-creations' ? 'active' : ''}`} onClick={closeMobileMenu}>OUR CREATIONS</Link>
              </li>
              <li>
                <Link href="/our-services" className={`header-mobile-nav-link ${pathname === '/our-services' ? 'active' : ''}`} onClick={closeMobileMenu}>OUR SERVICES</Link>
              </li>
              <li>
                <Link href="/how-to-place-order" className={`header-mobile-nav-link ${pathname === '/how-to-place-order' ? 'active' : ''}`} onClick={closeMobileMenu}>HOW IT WORKS</Link>
              </li>
              <li>
                <Link href="/blogs" className={`header-mobile-nav-link ${pathname === '/blogs' ? 'active' : ''}`} onClick={closeMobileMenu}>BLOG</Link>
              </li>
              <li>
                <Link href="/book-appointment" className={`header-mobile-nav-link ${pathname === '/book-appointment' ? 'active' : ''}`} onClick={closeMobileMenu}>BOOK APPOINTMENT</Link>
              </li>
              <li>
                <Link href="/testimonials" className={`header-mobile-nav-link ${pathname === '/testimonials' ? 'active' : ''}`} onClick={closeMobileMenu}>TESTIMONIALS</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
