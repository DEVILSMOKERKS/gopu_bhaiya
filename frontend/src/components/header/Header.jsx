'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
import logo from '../../assets/Images/img/logo8.png';

// ── Spiritual / Ancient God fallback images ────────────────────────────────────
const SPIRITUAL_IMGS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg/800px-Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image-Vishnu_Paria.jpg/800px-Image-Vishnu_Paria.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shiva_and_Parvati.jpg/800px-Shiva_and_Parvati.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Durga_Mahisasuramardini.jpg/800px-Durga_Mahisasuramardini.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Rama_and_Sita_with_Lakshmana_in_the_forest.jpg/800px-Rama_and_Sita_with_Lakshmana_in_the_forest.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hanuman_Ramayana.jpg/800px-Hanuman_Ramayana.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Saraswati_by_Raja_Ravi_Varma.jpg/800px-Saraswati_by_Raja_Ravi_Varma.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Lakshmi_by_Raja_Ravi_Varma.jpg/800px-Lakshmi_by_Raja_Ravi_Varma.jpg',
];

const FALLBACK_IMG = SPIRITUAL_IMGS[0];

// ── Static menus ──────────────────────────────────────────────────────────────
const OUR_CREATIONS_MENU = [
  { label: 'Custom Murtis',        href: '/our-creations', img: SPIRITUAL_IMGS[0] },
  { label: 'Temple Installations', href: '/our-creations', img: SPIRITUAL_IMGS[1] },
  { label: 'Festival Specials',    href: '/our-creations', img: SPIRITUAL_IMGS[2] },
  { label: 'Award & Gift Murtis',  href: '/our-creations', img: SPIRITUAL_IMGS[3] },
  { label: 'Portfolio Gallery',    href: '/our-creations', img: SPIRITUAL_IMGS[4] },
];

const OUR_SERVICES_MENU = [
  { label: 'Custom Carving',          href: '/our-services', img: SPIRITUAL_IMGS[5] },
  { label: 'Restoration & Repair',    href: '/our-services', img: SPIRITUAL_IMGS[6] },
  { label: 'Temple Design',           href: '/our-services', img: SPIRITUAL_IMGS[7] },
  { label: 'Prana Pratishtha',        href: '/our-services', img: SPIRITUAL_IMGS[2] },
  { label: 'Home Delivery & Install', href: '/our-services', img: SPIRITUAL_IMGS[1] },
];

const BLOG_MENU = [
  { label: 'Vastu & Murti Placement', href: '/blogs', img: SPIRITUAL_IMGS[3] },
  { label: 'Marble Care Tips',        href: '/blogs', img: SPIRITUAL_IMGS[4] },
  { label: 'Festival Guides',         href: '/blogs', img: SPIRITUAL_IMGS[5] },
  { label: 'All Articles',            href: '/blogs', img: SPIRITUAL_IMGS[6] },
];

// ── Shared image resolver (same as ProductByCategory.getProductImage) ──────────
function resolveProductImage(product, baseUrl) {
  if (product.colors?.length) {
    const firstColor = product.colors[0];
    const images = firstColor.images ?? (firstColor.image_url ? [firstColor.image_url] : []);
    const firstImage = Array.isArray(images) ? images[0] : images;
    if (firstImage) {
      const path = (
        typeof firstImage === 'string'
          ? firstImage
          : firstImage?.url || firstImage?.image_url || ''
      ).replace(/\\/g, '/');
      if (path) {
        return path.startsWith('http')
          ? path
          : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
      }
    }
  }
  if (product.featured_image) {
    const path = product.featured_image.replace(/\\/g, '/');
    return path.startsWith('http')
      ? path
      : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
  return null;
}

// ── Simple dropdown with live image preview ────────────────────────────────────
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

// ── Products mega dropdown with full product cards ─────────────────────────────
function ProductsMegaDropdown({ categories, baseUrl }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const validCategories = useMemo(() => categories.filter(
    (cat) => cat && cat.id != null && String(cat.name || '').trim() !== ''
  ), [categories]);
  const categoryIdsKey = useMemo(
    () => validCategories.map((cat) => cat.id).join(','),
    [validCategories]
  );

  // { [cat.id]: product[] }  full product data per category
  const [categoryProducts, setCategoryProducts] = useState({});

  // Which category is hovered
  const [activeCatId,   setActiveCatId]   = useState(null);
  const [activeCatSlug, setActiveCatSlug] = useState('');
  const [activeCatName, setActiveCatName] = useState('');

  // ── Fetch products for every category (same endpoint as ProductByCategory) ─
  useEffect(() => {
    if (!API_URL || validCategories.length === 0) return;

    // Seed first category as default active
    if (validCategories[0]) {
      const slug = validCategories[0].slug || validCategories[0].name?.toLowerCase().replace(/\s+/g, '-') || validCategories[0].id;
      setActiveCatId(validCategories[0].id);
      setActiveCatSlug(slug);
      setActiveCatName(validCategories[0].name || '');
    }

    validCategories.forEach((cat) => {
      axios
        .get(`${API_URL}/products/category/${cat.id}`, {
          params: { page: 1, limit: 12 },
        })
        .then((res) => {
          const products = res.data?.data ?? [];
          setCategoryProducts((prev) => ({ ...prev, [cat.id]: products }));
        })
        .catch(() => {
          setCategoryProducts((prev) => ({ ...prev, [cat.id]: [] }));
        });
    });
  }, [API_URL, categoryIdsKey]);

  // ── Hover handler ─────────────────────────────────────────────────────────
  const handleCategoryHover = (cat) => {
    const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id;
    setActiveCatId(cat.id);
    setActiveCatSlug(slug);
    setActiveCatName(cat.name || '');
  };

  // ── Build category nav items ──────────────────────────────────────────────
  const catItems = validCategories.map((cat) => {
    const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || cat.id;
    return { cat, label: cat.name || 'Category', href: `/products/${slug}` };
  });

  const allCatItems = [...catItems, { cat: null, label: 'View All →', href: '/products' }];

  // Active category's products
  const activeProducts = (activeCatId ? categoryProducts[activeCatId] : []) || [];
  const catIndex        = validCategories.findIndex((c) => c.id === activeCatId);
  const spiritualImg    = SPIRITUAL_IMGS[catIndex >= 0 ? catIndex % SPIRITUAL_IMGS.length : 0];
  const isActiveCategoryLoading = activeCatId != null && !(activeCatId in categoryProducts);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (validCategories.length === 0) {
    return (
      <div className="mega-dropdown mega-products-dropdown">
        <div className="mega-cat-col">
          <h4 className="mega-col-heading">Our Categories</h4>
          <div className="mega-empty-message">Categories are loading...</div>
        </div>
        <div className="mega-products-col">
          <div className="mega-products-col-header">
            <h4 className="mega-col-heading">Products</h4>
          </div>
          <div className="mega-products-loading">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="mega-product-skeleton">
                <div className="mega-product-skeleton-img" />
                <div className="mega-product-skeleton-text" />
                <div className="mega-product-skeleton-price" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mega-dropdown mega-products-dropdown">

      {/* ── Column 1: Category list ───────────────────────────────────── */}
      <div className="mega-cat-col">
        <h4 className="mega-col-heading">Our Categories</h4>
        {allCatItems.map((item) => (
          <Link
            key={item.label + item.href}
            href={item.href}
            className={`mega-cat-link ${item.cat && item.cat.id === activeCatId ? 'mega-cat-link--active' : ''}`}
            onMouseEnter={() => item.cat ? handleCategoryHover(item.cat) : null}
          >
            <span className="mega-dot" />
            {item.label}
            {item.cat && <span className="mega-cat-arrow">›</span>}
          </Link>
        ))}
      </div>

      {/* ── Column 2: Product cards for active category ───────────────── */}
      <div className="mega-products-col">
        <div className="mega-products-col-header">
          <h4 className="mega-col-heading">{activeCatName || 'Products'}</h4>
          {activeCatSlug && (
            <Link href={`/products/${activeCatSlug}`} className="mega-view-all-link">
              View All →
            </Link>
          )}
        </div>

        {isActiveCategoryLoading ? (
          /* Loading / empty state */
          <div className="mega-products-loading">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="mega-product-skeleton">
                <div className="mega-product-skeleton-img" />
                <div className="mega-product-skeleton-text" />
                <div className="mega-product-skeleton-price" />
              </div>
            ))}
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="mega-empty-message mega-empty-message--products">
            Products for this category will appear here.
          </div>
        ) : (
          <div className="mega-products-grid">
            {activeProducts.slice(0, 8).map((product) => {
              const img = resolveProductImage(product, baseUrl) || spiritualImg;
              const minPrice = product.min_price ?? product.price ?? null;
              const maxPrice = product.max_price ?? null;

              return (
                <Link
                  key={product.product_id}
                  href={`/product/${product.product_id}`}
                  className="mega-product-card"
                >
                  {/* Product Image */}
                  <div className="mega-product-img-wrap">
                    <img
                      src={img}
                      alt={product.name || 'Product'}
                      className="mega-product-img"
                      onError={(e) => { e.target.src = spiritualImg; }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="mega-product-info">
                    <p className="mega-product-name">
                      {product.name?.length > 28
                        ? `${product.name.slice(0, 28)}…`
                        : product.name || 'Product'}
                    </p>
                    <p className="mega-product-price">
                      {minPrice != null
                        ? maxPrice && maxPrice !== minPrice
                          ? `₹${Number(minPrice).toLocaleString('en-IN')} – ₹${Number(maxPrice).toLocaleString('en-IN')}`
                          : `₹${Number(minPrice).toLocaleString('en-IN')}`
                        : 'Price on request'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
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
  const [navCategories,     setNavCategories]     = useState([]);
  const [navProducts,       setNavProducts]       = useState([]);

  const { cart, wishlist } = useWishlistCart();
  const { user, isAuthenticated } = useUser();
  const searchTimeoutRef   = useRef(null);
  const searchContainerRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl  = API_URL ? API_URL.replace('/api', '') : '';

  useEffect(() => {
    if (!API_URL) return;
    Promise.all([
      axios.get(`${API_URL}/categories`),
      axios.get(`${API_URL}/products`, {
        params: { page: 1, limit: 1000 },
      }),
    ])
      .then(([categoryRes, productRes]) => {
        const categoryData = categoryRes.data?.success && Array.isArray(categoryRes.data.data)
          ? categoryRes.data.data.filter((c) => c.status !== 'inactive')
          : [];
        const productData = Array.isArray(productRes.data?.data)
          ? productRes.data.data.filter((product) => product.category_id != null)
          : [];

        setNavCategories(categoryData);
        setNavProducts(productData);
      })
      .catch(() => {});
  }, [API_URL]);

  const visibleNavCategories = useMemo(() => {
    const byCategoryId = new Map();

    navProducts.forEach((product) => {
      if (product.category_id == null) return;

      const existingCategory = navCategories.find((category) => category.id === product.category_id);
      const fallbackName = String(existingCategory?.name || product.category_name || '').trim();
      if (!fallbackName) return;

      const fallbackSlug = fallbackName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

      if (!byCategoryId.has(product.category_id)) {
        byCategoryId.set(product.category_id, {
          id: product.category_id,
          name: fallbackName,
          slug: existingCategory?.slug || product.category_slug || fallbackSlug || String(product.category_id),
        });
      }
    });

    return Array.from(byCategoryId.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [navCategories, navProducts]);

  useEffect(() => {
    if (!isHomePage) setIsScrolled(true);
    const onScroll = () =>
      setIsScrolled((window.pageYOffset || document.documentElement.scrollTop) > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  const performSearch = async (query) => {
    if (!query.trim()) { setSearchResults([]); setShowSearchResults(false); return; }
    try {
      setIsSearching(true);
      const res = await axios.get(`${API_URL}/products`, {
        params: { search: query, limit: 8 },
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

  useEffect(() => () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  }, []);

  const getProductImage = (product) => resolveProductImage(product, baseUrl) || '/placeholder-product.jpg';

  const mobileNavItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/our-creations', label: 'Creations' },
    { href: '/our-services', label: 'Services' },
    { href: '/how-to-place-order', label: 'How It Works' },
    { href: '/blogs', label: 'Blog' },
    { href: '/book-appointment', label: 'Book Now' },
    { href: '/testimonials', label: 'Reviews' },
  ];

  const isNavItemActive = (href) => (
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname?.startsWith(`${href}/`)
  );

  return (
    <>
      <AnnouncementSlider />

      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>

        {/* ── Top Bar ─────────────────────────────────────────────────────── */}
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
                    <div className="header-search-loading">Searching…</div>
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
                              onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                            />
                          </div>
                          <div className="header-search-result-content">
                            <h4 className="header-search-result-title">{product.name}</h4>
                            <p className="header-search-result-price">
                              ₹{product.min_price} – ₹{product.max_price}
                            </p>
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

          <div className="header-top-center">
            <Link href="/" className="header-logo-link">
              <Image src={logo} alt="Welcome To Mateshwari Moorti Bhanda" className="header-logo-img" width={260} height={96} priority />
            </Link>
          </div>

          <div className="header-top-right">
            <div className="header-social-icons">
              <a href="https://www.instagram.com/reel/DVA2HgUknfx/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer" className="header-social-icon-link instagram" aria-label="Instagram">
                <FaInstagram className="header-social-icon" />
              </a>
              <a href="https://facebook.com/share/18i5K67wfR/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="header-social-icon-link facebook" aria-label="Facebook">
                <FaFacebook className="header-social-icon" />
              </a>
              <a href="https://youtube.com/@mateshwarimoortibhandar?si=aS0wJmJW-7apUe2f" target="_blank" rel="noopener noreferrer" className="header-social-icon-link youtube" aria-label="YouTube">
                <FaYoutube className="header-social-icon" />
              </a>
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

            <div className="nav-item nav-item--products">
              <Link
                href="/products"
                className={`nav-link ${pathname === '/products' || pathname?.startsWith('/products/') ? 'active' : ''}`}
              >
                PRODUCTS <span className="nav-arrow">▾</span>
              </Link>
              <ProductsMegaDropdown categories={visibleNavCategories} baseUrl={baseUrl} />
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
              <Link href="/how-to-place-order" className={`nav-link ${pathname === '/how-to-place-order' ? 'active' : ''}`}>
                HOW IT WORKS
              </Link>
            </div>

            <div className="nav-item">
              <Link
                href="/blogs"
                className={`nav-link ${pathname === '/blogs' || pathname?.startsWith('/blog/') ? 'active' : ''}`}
              >
                BLOG <span className="nav-arrow">▾</span>
              </Link>
              <ImageDropdown items={BLOG_MENU} />
            </div>

            <div className="nav-item">
              <Link href="/book-appointment" className={`nav-link ${pathname === '/book-appointment' ? 'active' : ''}`}>
                BOOK APPOINTMENT
              </Link>
            </div>

            <div className="nav-item">
              <Link href="/testimonials" className={`nav-link ${pathname === '/testimonials' ? 'active' : ''}`}>
                TESTIMONIALS
              </Link>
            </div>

          </div>
        </nav>

        {/* ── Mobile Header ───────────────────────────────────────────────── */}
        <div className="header-mobile">
          <div className="header-mobile-top">
            <button
              className="header-mobile-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <HiMenu className="header-mobile-hamburger-icon" />
            </button>
            <Link href="/" className="header-mobile-logo-link">
              <Image src={logo} alt="Welcome To Mateshwari Moorti Bhanda" className="header-mobile-logo-img" width={180} height={66} priority />
            </Link>
            <div className="header-mobile-social-icons">
              <a href="https://www.instagram.com/mateshwari_exports/" target="_blank" rel="noopener noreferrer" className="header-mobile-social-icon-link" aria-label="Instagram">
                <FaInstagram className="header-mobile-social-icon" />
              </a>
              <a href="https://www.facebook.com/mateshwariexports/" target="_blank" rel="noopener noreferrer" className="header-mobile-social-icon-link" aria-label="Facebook">
                <FaFacebook className="header-mobile-social-icon" />
              </a>
            </div>
          </div>

          <div className="header-mobile-bottom">
            <button
              className="header-mobile-expert-btn"
              type="button"
              onClick={() => setIsExpertPopupOpen(true)}
            >
              Ask Our Experts
            </button>
          </div>

          <div className="header-mobile-slider" aria-label="Quick navigation">
            {mobileNavItems.map(({ href, label }) => {
              return (
                <Link
                  key={href}
                  href={href}
                  className={`header-mobile-slider-link ${isNavItemActive(href) ? 'active' : ''}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="header-mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <div className={`header-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="header-mobile-menu-header">
            <div className="header-mobile-menu-logo">
              <Image src={logo} alt="Welcome To Mateshwari Moorti Bhanda" width={180} height={66} priority />
            </div>
            <button className="header-mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close">
              <HiX className="header-mobile-menu-close-icon" />
            </button>
          </div>

          <nav className="header-mobile-nav">
            <ul className="header-mobile-nav-links">
              {mobileNavItems.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`header-mobile-nav-link ${isNavItemActive(href) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>

            {visibleNavCategories.length > 0 && (
              <div className="header-mobile-categories">
                <p className="header-mobile-categories-title">Browse Categories</p>
                {visibleNavCategories.map((cat) => {
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
