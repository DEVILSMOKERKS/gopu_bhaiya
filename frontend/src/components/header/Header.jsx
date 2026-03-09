'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { HiMenu, HiX, HiSearch } from 'react-icons/hi';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import axios from 'axios';
import { useWishlistCart } from '../../context/wishlistCartContext';
import { useUser } from '../../context/UserContext';
import ExpertPopup from './ExpertPopup';
import AnnouncementSlider from './AnnouncementSlider'; // Import karo
import './header.css';
import logo from '../../assets/Images/img/logobanner.png';

const Header = ({ onAccountClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpertPopupOpen, setIsExpertPopupOpen] = useState(false);
  const { cart, wishlist } = useWishlistCart();
  const { user, isAuthenticated } = useUser();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Handle scroll event to change header background
  useEffect(() => {
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
    };
  }, [isHomePage]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
  
    try {
      setIsSearching(true);
  
      const response = await axios.get(
        `${API_URL}/products`,
        {
          params: {
            search: query,
            limit: 8,
          },
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
  
      const products = response.data?.data || [];
      setSearchResults(products);
      setShowSearchResults(true);
  
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };
  
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

  const handleSearchResultClick = (product) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setIsSearchOpen(false);
    router.push(`/product/${product.product_id}`);
  };

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

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const getProductImage = (product) => {
    if (!product.colors || product.colors.length === 0) {
      return '/placeholder-product.jpg';
    }

    const firstColor = product.colors[0];
    const firstImage = firstColor.images && firstColor.images.length > 0 ? firstColor.images[0] : null;

    if (!firstImage) {
      return '/placeholder-product.jpg';
    }

    let relativePath = '';
    if (typeof firstImage === 'string') {
      relativePath = firstImage;
    } else if (typeof firstImage === 'object' && firstImage !== null) {
      relativePath =
        firstImage.image_url ||
        firstImage.url ||
        firstImage.path ||
        firstImage.src ||
        '';
    }

    if (!relativePath) {
      return '/placeholder-product.jpg';
    }

    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    if (!relativePath.startsWith('/')) {
      relativePath = `/${relativePath}`;
    }

    const baseUrl = API_URL ? API_URL.replace('/api', '') : '';
    return `${baseUrl}${relativePath}`;
  };

  return (
    <>
      {/* Announcement Slider - Top of the page */}
      <AnnouncementSlider />
      
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        {/* Top Bar */}
        <div className="header-top-bar">
          <div className="header-top-left">
            <div className="header-search-bar" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="header-search-form">
                <HiSearch className="header-search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="header-search-input"
                />
              </form>
              {showSearchResults && (
                <div className="header-search-results">
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
                            <Image 
                              src={getProductImage(product)} 
                              alt={product.name} 
                              width={60} 
                              height={60}
                              onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                              }}
                            />
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
                  ) : (
                    <div className="header-search-no-results">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="header-top-center">
            <Link href="/" className="header-logo-link">
              <Image 
                src={logo} 
                alt="Mateshwari Moorti Bhandar" 
                className="header-logo-img" 
                width={150} 
                height={50} 
                priority 
              />
            </Link>
          </div>

          <div className="header-top-right">
            {/* Social Icons */}
            <div className="header-social-icons">
              <a
                href="https://www.instagram.com/mateshwari_exports/"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-icon-link instagram"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="header-social-icon" />
              </a>
              <a
                href="https://www.facebook.com/mateshwariexports/"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-icon-link facebook"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook className="header-social-icon" />
              </a>
              <a
                href="https://youtube.com/@mateshwarimoortibhandar"
                target="_blank"
                rel="noopener noreferrer"
                className="header-social-icon-link youtube"
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube className="header-social-icon" />
              </a>
            </div>

            {/* ASK EXPERTS Button - Clean version without decorative spans */}
            <button
              className="header-expert-btn"
              type="button"
              onClick={() => setIsExpertPopupOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              ASK EXPERTS
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="header-nav-bar">
          <div className="header-nav-links">
            <div className="nav-item">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>HOME</Link>
            </div>

            <div className="nav-item">
              <Link href="/products" className={`nav-link ${pathname === '/products' || pathname?.startsWith('/products/') ? 'active' : ''}`}>
                PRODUCTS <span className="nav-arrow">▾</span>
              </Link>
              <div className="mega-dropdown">
                <div className="mega-col">
                  <h4>By Deity</h4>
                  <Link href="/products"><span className="mega-dot"></span>Ganesha Murti</Link>
                  <Link href="/products"><span className="mega-dot"></span>Radha Krishna</Link>
                  <Link href="/products"><span className="mega-dot"></span>Lakshmi Mata</Link>
                  <Link href="/products"><span className="mega-dot"></span>Shiva Lingam</Link>
                  <Link href="/products"><span className="mega-dot"></span>Saraswati Devi</Link>
                  <Link href="/products"><span className="mega-dot"></span>Hanuman Ji</Link>
                </div>
                <div className="mega-col">
                  <h4>By Material</h4>
                  <Link href="/products"><span className="mega-dot"></span>White Marble</Link>
                  <Link href="/products"><span className="mega-dot"></span>Black Marble</Link>
                  <Link href="/products"><span className="mega-dot"></span>Makrana Marble</Link>
                  <Link href="/products"><span className="mega-dot"></span>Sandstone</Link>
                  <Link href="/products"><span className="mega-dot"></span>Fibre Murti</Link>
                  <Link href="/products"><span className="mega-dot"></span>Brass Idols</Link>
                </div>
                <div className="mega-col">
                  <h4>By Size</h4>
                  <Link href="/products"><span className="mega-dot"></span>Small (6&quot;–12&quot;)</Link>
                  <Link href="/products"><span className="mega-dot"></span>Medium (1–2 ft)</Link>
                  <Link href="/products"><span className="mega-dot"></span>Large (2–4 ft)</Link>
                  <Link href="/products"><span className="mega-dot"></span>Temple Size (4+ ft)</Link>
                  <Link href="/products"><span className="mega-dot"></span>Pooja Sets</Link>
                  <Link href="/products"><span className="mega-dot"></span>View All →</Link>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <Link href="/our-creations" className={`nav-link ${pathname === '/our-creations' ? 'active' : ''}`}>
                OUR CREATIONS <span className="nav-arrow">▾</span>
              </Link>
              <div className="nav-dropdown">
                <Link href="/our-creations"><span className="mega-dot"></span>Custom Murtis</Link>
                <Link href="/our-creations"><span className="mega-dot"></span>Temple Installations</Link>
                <Link href="/our-creations"><span className="mega-dot"></span>Festival Specials</Link>
                <Link href="/our-creations"><span className="mega-dot"></span>Award & Gift Murtis</Link>
                <Link href="/our-creations"><span className="mega-dot"></span>Portfolio Gallery</Link>
              </div>
            </div>

            <div className="nav-item">
              <Link href="/our-services" className={`nav-link ${pathname === '/our-services' ? 'active' : ''}`}>
                OUR SERVICES <span className="nav-arrow">▾</span>
              </Link>
              <div className="nav-dropdown">
                <Link href="/our-services"><span className="mega-dot"></span>Custom Carving</Link>
                <Link href="/our-services"><span className="mega-dot"></span>Restoration & Repair</Link>
                <Link href="/our-services"><span className="mega-dot"></span>Temple Design</Link>
                <Link href="/our-services"><span className="mega-dot"></span>Prana Pratishtha</Link>
                <Link href="/our-services"><span className="mega-dot"></span>Home Delivery & Install</Link>
              </div>
            </div>

            <div className="nav-item">
              <Link href="/how-to-place-order" className={`nav-link ${pathname === '/how-to-place-order' ? 'active' : ''}`}>HOW IT WORKS</Link>
            </div>

            <div className="nav-item">
              <Link href="/blogs" className={`nav-link ${pathname === '/blogs' || pathname?.startsWith('/blog/') ? 'active' : ''}`}>
                BLOG <span className="nav-arrow">▾</span>
              </Link>
              <div className="nav-dropdown">
                <Link href="/blogs"><span className="mega-dot"></span>Vastu & Murti Placement</Link>
                <Link href="/blogs"><span className="mega-dot"></span>Marble Care Tips</Link>
                <Link href="/blogs"><span className="mega-dot"></span>Festival Guides</Link>
                <Link href="/blogs"><span className="mega-dot"></span>All Articles</Link>
              </div>
            </div>

            <div className="nav-item">
              <Link href="/book-appointment" className={`nav-link ${pathname === '/book-appointment' ? 'active' : ''}`}>BOOK APPOINTMENT</Link>
            </div>

            <div className="nav-item">
              <Link href="/testimonials" className={`nav-link ${pathname === '/testimonials' ? 'active' : ''}`}>TESTIMONIALS</Link>
            </div>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="header-mobile">
          <button
            className="header-mobile-hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <HiMenu className="header-mobile-hamburger-icon" />
          </button>
          
          <Link href="/" className="header-mobile-logo-link">
            <Image 
              src={logo} 
              alt="Mateshwari Moorti Bhandar" 
              className="header-mobile-logo-img" 
              width={120} 
              height={40} 
              priority 
            />
          </Link>
          
          <div className="header-mobile-social-icons">
            <a
              href="https://www.instagram.com/mateshwari_exports/"
              target="_blank"
              rel="noopener noreferrer"
              className="header-mobile-social-icon-link"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram className="header-mobile-social-icon" />
            </a>
            <a
              href="https://www.facebook.com/mateshwariexports/"
              target="_blank"
              rel="noopener noreferrer"
              className="header-mobile-social-icon-link"
              aria-label="Follow us on Facebook"
            >
              <FaFacebook className="header-mobile-social-icon" />
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="header-mobile-menu-backdrop"
            onClick={closeMobileMenu}
          ></div>
        )}
        
        <div className={`header-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="header-mobile-menu-header">
            <div className="header-mobile-menu-logo">
              <Image 
                src={logo} 
                alt="Mateshwari Moorti Bhandar" 
                width={120} 
                height={40} 
                priority 
              />
            </div>
            <button
              className="header-mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <HiX className="header-mobile-menu-close-icon" />
            </button>
          </div>
          
          <nav className="header-mobile-nav">
            <ul className="header-mobile-nav-links">
              <li>
                <Link href="/" className={`header-mobile-nav-link ${pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/products" className={`header-mobile-nav-link ${pathname === '/products' ? 'active' : ''}`} onClick={closeMobileMenu}>PRODUCTS</Link>
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

      <ExpertPopup
        isOpen={isExpertPopupOpen}
        onClose={() => setIsExpertPopupOpen(false)}
        API_URL={API_URL}
      />
    </>
  );
};

export default Header;