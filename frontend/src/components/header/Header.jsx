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
import AnnouncementSlider from './AnnouncementSlider';
import './header.css';
import logo from '../../assets/Images/img/logobanner.png';

// ── Static menus (non-category) ────────────────────────────────────────────────
const OUR_CREATIONS_MENU = [
  { label: 'Custom Murtis',        href: '/our-creations', img: 'https://images.unsplash.com/photo-1567591370830-8dd9ef3b3e2c?w=320&q=80' },
  { label: 'Temple Installations', href: '/our-creations', img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=320&q=80' },
  { label: 'Festival Specials',    href: '/our-creations', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=320&q=80' },
  { label: 'Award & Gift Murtis',  href: '/our-creations', img: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=320&q=80' },
  { label: 'Portfolio Gallery',    href: '/our-creations', img: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=320&q=80' },
];

const OUR_SERVICES_MENU = [
  { label: 'Custom Carving',          href: '/our-services', img: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=320&q=80' },
  { label: 'Restoration & Repair',    href: '/our-services', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&q=80' },
  { label: 'Temple Design',           href: '/our-services', img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=320&q=80' },
  { label: 'Prana Pratishtha',        href: '/our-services', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=320&q=80' },
  { label: 'Home Delivery & Install', href: '/our-services', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=320&q=80' },
];

const BLOG_MENU = [
  { label: 'Vastu & Murti Placement', href: '/blogs', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=320&q=80' },
  { label: 'Marble Care Tips',        href: '/blogs', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&q=80' },
  { label: 'Festival Guides',         href: '/blogs', img: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=320&q=80' },
  { label: 'All Articles',            href: '/blogs', img: 'https://images.unsplash.com/photo-1567591370830-8dd9ef3b3e2c?w=320&q=80' },
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=320&q=80';

// ── Reusable: simple dropdown with live image preview ─────────────────────────
function ImageDropdown({ items }) {
  const [previewImg, setPreviewImg] = useState(items[0]?.img || FALLBACK_IMG);
  return (
    <div className="nav-dropdown img-dropdown">
      <div className="img-dropdown-list">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="img-dropdown-link"
            onMouseEnter={() => setPreviewImg(item.img || FALLBACK_IMG)}
          >
            <span className="mega-dot" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="img-dropdown-preview">
        <img
          src={previewImg}
          alt="preview"
          className="img-dropdown-img"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        <div className="img-dropdown-overlay" />
      </div>
    </div>
  );
}

// ── Products mega dropdown – categories from GET /api/categories ───────────────
function ProductsMegaDropdown({ categories, baseUrl }) {
  // Convert API categories → { label, href, img }
  const items = categories.map((cat) => {
    const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id;
    let img = FALLBACK_IMG;
    if (cat.image_url) {
      const path = String(cat.image_url).replace(/\\/g, '/');
      img = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }
    return { label: cat.name || 'Category', href: `/products/${slug}`, img };
  });

  // Append "View All"
  const allItems = [...items, { label: 'View All →', href: '/products', img: FALLBACK_IMG }];

  // Split into columns of up to 7, max 3 columns
  const CHUNK = 7;
  const rawCols = [];
  for (let i = 0; i < allItems.length; i += CHUNK) rawCols.push(allItems.slice(i, i + CHUNK));
  const columns = rawCols.slice(0, 3);

  const [previewImg,   setPreviewImg]   = useState(allItems[0]?.img   || FALLBACK_IMG);
  const [previewLabel, setPreviewLabel] = useState(allItems[0]?.label || '');

  // Re-sync when categories first load
  useEffect(() => {
    if (allItems[0]) { setPreviewImg(allItems[0].img); setPreviewLabel(allItems[0].label); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  // Loading skeleton
  if (categories.length === 0) {
    return (
      <div className="mega-dropdown mega-img-dropdown">
        <div className="mega-img-cols">
          <div className="mega-col">
            <h4>Categories</h4>
            {[1, 2, 3, 4, 5].map((n) => <div key={n} className="mega-skeleton-row" />)}
          </div>
        </div>
        <div className="mega-img-preview">
          <div className="mega-img-preview-skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="mega-dropdown mega-img-dropdown">
      {/* Columns */}
      <div
        className="mega-img-cols"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {columns.map((col, ci) => (
          <div className="mega-col" key={ci}>
            <h4>{ci === 0 ? 'Our Categories' : <>&nbsp;</>}</h4>
            {col.map((item) => (
              <Link
                key={item.label + item.href}
                href={item.href}
                onMouseEnter={() => { setPreviewImg(item.img); setPreviewLabel(item.label); }}
              >
                <span className="mega-dot" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Live preview panel */}
      <div className="mega-img-preview">
        <img
          key={previewImg}
          src={previewImg}
          alt={previewLabel}
          className="mega-img-preview-img"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        <div className="mega-img-preview-overlay">
          <span className="mega-img-preview-label">{previewLabel}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Header ────────────────────────────────────────────────────────────────
const Header = ({ onAccountClick }) => {
  const pathname   = usePathname();
  const router     = useRouter();
  const isHomePage = pathname === '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [searchResults,     setSearchResults]     = useState([]);
  const [isSearching,       setIsSearching]       = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isScrolled,        setIsScrolled]        = useState(false);
  const [isExpertPopupOpen, setIsExpertPopupOpen] = useState(false);

  // Live categories for the Products nav dropdown
  const [navCategories, setNavCategories] = useState([]);

  const { cart, wishlist } = useWishlistCart();
  const { user, isAuthenticated } = useUser();
  const searchTimeoutRef   = useRef(null);
  const searchContainerRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl  = API_URL ? API_URL.replace('/api', '') : '';

  // ── Fetch categories once on mount ────────────────────────────────────────
  useEffect(() => {
    if (!API_URL) return;
    axios
      .get(`${API_URL}/categories`, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setNavCategories(res.data.data.filter((c) => c.status !== 'inactive'));
        }
      })
      .catch(() => {}); // silent fail – "View All" still shows
  }, [API_URL]);

  // ── Scroll ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isHomePage) setIsScrolled(true);
    const onScroll = () =>
      setIsScrolled((window.pageYOffset || document.documentElement.scrollTop) > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  // ── Search ────────────────────────────────────────────────────────────────
  const performSearch = async (query) => {
    if (!query.trim()) { setSearchResults([]); setShowSearchResults(false); return; }
    try {
      setIsSearching(true);
      const res = await axios.get(`${API_URL}/products`, {
        params: { search: query, limit: 8 },
        headers: { 'Cache-Control': 'no-cache' },
      });
      setSearchResults(res.data?.data || []);
      setShowSearchResults(true);
    } catch {
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => performSearch(q), 300);
  };

  const handleSearchResultClick = (product) => {
    setSearchQuery(''); setSearchResults([]); setShowSearchResults(false);
    router.push(`/product/${product.product_id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); setSearchResults([]); setShowSearchResults(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target))
        setShowSearchResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); }, []);

  const getProductImage = (product) => {
    if (!product.colors?.length) return '/placeholder-product.jpg';
    const fi = product.colors[0]?.images?.[0];
    if (!fi) return '/placeholder-product.jpg';
    let rel = typeof fi === 'string' ? fi : (fi.image_url || fi.url || fi.path || fi.src || '');
    if (!rel) return '/placeholder-product.jpg';
    if (rel.startsWith('http')) return rel;
    if (!rel.startsWith('/')) rel = `/${rel}`;
    return `${baseUrl}${rel}`;
  };

  return (
    <>
      <AnnouncementSlider />

      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>

        {/* ── Top Bar ─────────────────────────────────────────────────────── */}
        <div className="header-top-bar">

          {/* Search */}
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
                    <div className="header-search-loading">Searching…</div>
                  ) : searchResults.length > 0 ? (
                    <div className="header-search-results-list">
                      {searchResults.map((product) => (
                        <div key={product.product_id} className="header-search-result-item" onClick={() => handleSearchResultClick(product)}>
                          <div className="header-search-result-image">
                            <Image src={getProductImage(product)} alt={product.name} width={60} height={60} onError={(e) => { e.target.src = '/placeholder-product.jpg'; }} />
                          </div>
                          <div className="header-search-result-content">
                            <h4 className="header-search-result-title">{product.name}</h4>
                            <p className="header-search-result-price">₹{product.min_price} – ₹{product.max_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="header-search-no-results">No products found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <div className="header-top-center">
            <Link href="/" className="header-logo-link">
              <Image src={logo} alt="Mateshwari Moorti Bhandar" className="header-logo-img" width={150} height={50} priority />
            </Link>
          </div>

          {/* Social + Expert */}
          <div className="header-top-right">
            <div className="header-social-icons">
              <a href="https://www.instagram.com/reel/DVA2HgUknfx/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer" className="header-social-icon-link instagram" aria-label="Instagram"><FaInstagram className="header-social-icon" /></a>
              <a href="facebook.com/share/18i5K67wfR/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="header-social-icon-link facebook" aria-label="Facebook"><FaFacebook className="header-social-icon" /></a>
              <a href="https://youtube.com/@mateshwarimoortibhandar?si=aS0wJmJW-7apUe2f" target="_blank" rel="noopener noreferrer" className="header-social-icon-link youtube" aria-label="YouTube"><FaYoutube className="header-social-icon" /></a>
            </div>
            <button className="header-expert-btn" type="button" onClick={() => setIsExpertPopupOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              ASK EXPERTS
            </button>
          </div>
        </div>

        {/* ── Nav Bar ─────────────────────────────────────────────────────── */}
        <nav className="header-nav-bar">
          <div className="header-nav-links">

            <div className="nav-item">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>HOME</Link>
            </div>

            {/* PRODUCTS ← live API categories */}
            <div className="nav-item">
              <Link href="/products" className={`nav-link ${pathname === '/products' || pathname?.startsWith('/products/') ? 'active' : ''}`}>
                PRODUCTS <span className="nav-arrow">▾</span>
              </Link>
              <ProductsMegaDropdown categories={navCategories} baseUrl={baseUrl} />
            </div>

            <div className="nav-item">
              <Link href="/our-creations" className={`nav-link ${pathname === '/our-creations' ? 'active' : ''}`}>
                OUR CREATIONS <span className="nav-arrow">▾</span>
              </Link>
              <ImageDropdown items={OUR_CREATIONS_MENU} />
            </div>

            <div className="nav-item">
              <Link href="/our-services" className={`nav-link ${pathname === '/our-services' ? 'active' : ''}`}>
                OUR SERVICES <span className="nav-arrow">▾</span>
              </Link>
              <ImageDropdown items={OUR_SERVICES_MENU} />
            </div>

            <div className="nav-item">
              <Link href="/how-to-place-order" className={`nav-link ${pathname === '/how-to-place-order' ? 'active' : ''}`}>HOW IT WORKS</Link>
            </div>

            <div className="nav-item">
              <Link href="/blogs" className={`nav-link ${pathname === '/blogs' || pathname?.startsWith('/blog/') ? 'active' : ''}`}>
                BLOG <span className="nav-arrow">▾</span>
              </Link>
              <ImageDropdown items={BLOG_MENU} />
            </div>

            <div className="nav-item">
              <Link href="/book-appointment" className={`nav-link ${pathname === '/book-appointment' ? 'active' : ''}`}>BOOK APPOINTMENT</Link>
            </div>

            <div className="nav-item">
              <Link href="/testimonials" className={`nav-link ${pathname === '/testimonials' ? 'active' : ''}`}>TESTIMONIALS</Link>
            </div>

          </div>
        </nav>

        {/* ── Mobile Header ───────────────────────────────────────────────── */}
        <div className="header-mobile">
          <button className="header-mobile-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
            <HiMenu className="header-mobile-hamburger-icon" />
          </button>
          <Link href="/" className="header-mobile-logo-link">
            <Image src={logo} alt="Mateshwari Moorti Bhandar" className="header-mobile-logo-img" width={120} height={40} priority />
          </Link>
          <div className="header-mobile-social-icons">
            <a href="https://www.instagram.com/mateshwari_exports/" target="_blank" rel="noopener noreferrer" className="header-mobile-social-icon-link" aria-label="Instagram"><FaInstagram className="header-mobile-social-icon" /></a>
            <a href="https://www.facebook.com/mateshwariexports/" target="_blank" rel="noopener noreferrer" className="header-mobile-social-icon-link" aria-label="Facebook"><FaFacebook className="header-mobile-social-icon" /></a>
          </div>
        </div>

        {isMobileMenuOpen && <div className="header-mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />}

        <div className={`header-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="header-mobile-menu-header">
            <div className="header-mobile-menu-logo">
              <Image src={logo} alt="Mateshwari Moorti Bhandar" width={120} height={40} priority />
            </div>
            <button className="header-mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close">
              <HiX className="header-mobile-menu-close-icon" />
            </button>
          </div>

          <nav className="header-mobile-nav">
            <ul className="header-mobile-nav-links">
              {[
                { href: '/',                   label: 'HOME' },
                { href: '/products',           label: 'PRODUCTS' },
                { href: '/our-creations',      label: 'OUR CREATIONS' },
                { href: '/our-services',       label: 'OUR SERVICES' },
                { href: '/how-to-place-order', label: 'HOW IT WORKS' },
                { href: '/blogs',              label: 'BLOG' },
                { href: '/book-appointment',   label: 'BOOK APPOINTMENT' },
                { href: '/testimonials',       label: 'TESTIMONIALS' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={`header-mobile-nav-link ${pathname === href ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile: live category links below PRODUCTS */}
            {navCategories.length > 0 && (
              <div className="header-mobile-categories">
                <p className="header-mobile-categories-title">Browse Categories</p>
                {navCategories.map((cat) => {
                  const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/products/${slug}`}
                      className="header-mobile-category-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mega-dot" />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

      </header>

      <ExpertPopup isOpen={isExpertPopupOpen} onClose={() => setIsExpertPopupOpen(false)} API_URL={API_URL} />
    </>
  );
};

export default Header;