'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';
import './shop.css';
// import shopBanner from '../../assets/Images/banner/hero6.jpg';
// import shopBannerMobile from '../../assets/Images/banner/shopBannerMobile.jpg';
import { useUser } from '../../context/UserContext';

const shopBanner = "https://ik.imagekit.io/adsrc2244/mateshwarimoortibhandar/main-page/hero6.jpg?updatedAt=1761545267298";

const shopBannerMobile = "https://ik.imagekit.io/adsrc2244/mateshwarimoortibhandar/main-page/shopBannerMobile.jpg?updatedAt=1761546052823"

const Shop = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, token, isAuthenticated } = useUser();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Get search parameter from URL
  const searchQuery = searchParams?.get('search') || null;
  const collectionParam = searchParams?.get('collection') || null;
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  // Product color selection state
  const [selectedProductColors, setSelectedProductColors] = useState({});

  // Load more state
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Mobile filter modal state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    sortBy: true,  // Keep first section (Sort By) open
    size: false,   // Close size section
    color: false,  // Close color section
    collection: false  // Close collection section
  });

  // API state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Fetch products on component mount and when search query changes
  useEffect(() => {
    fetchProducts(1, {});
  }, [searchQuery]);

  // Fetch products from API
  const fetchProducts = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...filters
      });

      // Add search parameter if present
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      const response = await axios.get(`${API_URL}/products?${queryParams}`);

      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Error fetching products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to products
  const applyFilters = () => {
    let filtered = [...products];

    // Apply size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.sizes || product.sizes.length === 0) return false;
        return product.sizes.some(sizeObj => {
          // Check if any selected size matches the product size
          return selectedSizes.some(selectedSize => {
            // Handle different size formats - ensure size is a string
            const sizeStr = String(sizeObj.size || '').toLowerCase();
            const selectedSizeStr = String(selectedSize || '').toLowerCase();
            const sizeMatch = sizeStr.includes(selectedSizeStr.split(' ')[0]);
            return sizeMatch;
          });
        });
      });
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && product.colors.some(color => selectedColors.includes(color.color_name))
      );
    }

    // Apply collection filter (categories only)
    if (selectedCollections.length > 0) {
      filtered = filtered.filter(product => {
        // Check category-based collections
        if (product.category_name && selectedCollections.includes(product.category_name)) {
          return true;
        }
        if (product.subcategory_name && selectedCollections.includes(product.subcategory_name)) {
          return true;
        }

        return false;
      });
    }


    // Apply sorting
    switch (sortBy) {
      case 'price_low_high':
        filtered.sort((a, b) => (a.min_price || 0) - (b.min_price || 0));
        break;
      case 'price_high_low':
        filtered.sort((a, b) => (b.min_price || 0) - (a.min_price || 0));
        break;
      case 'best_seller':
        filtered.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
        break;
      case 'featured':
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
    setVisibleProducts(12); // Reset visible products when filters change
  };

  // Update applied filters display
  const updateAppliedFilters = () => {
    const filters = [
      ...selectedSizes,
      ...selectedColors,
      ...selectedCollections
    ];
    setAppliedFilters(filters);
  };

  // Fetch wishlist status for all products
  const fetchWishlistStatus = async () => {
    if (!isAuthenticated) return;

    try {
      const wishlistStatuses = await Promise.all(
        filteredProducts.map(async (product) => {
          try {
            const response = await axios.get(`${API_URL}/wishlist/check/${product.product_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            const data = response.data;
            return {
              product_id: product.product_id,
              is_in_wishlist: data.success ? data.data.is_in_wishlist : false
            };
          } catch (error) {
            console.error(`Error checking wishlist status for product ${product.product_id}:`, error);
            return {
              product_id: product.product_id,
              is_in_wishlist: false
            };
          }
        })
      );

      const wishlistSet = new Set();
      wishlistStatuses.forEach(status => {
        if (status.is_in_wishlist) {
          wishlistSet.add(status.product_id);
        }
      });
      setWishlistItems(wishlistSet);
    } catch (error) {
      console.error('Error fetching wishlist statuses:', error);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await axios.post(`${API_URL}/wishlist/add`, { product_id: productId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data.success) {
        setWishlistItems(prev => new Set([...prev, productId]));
      } else {
        console.error('Failed to add to wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await axios.delete(`${API_URL}/wishlist/product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data.success) {
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        console.error('Failed to remove from wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Toggle wishlist status
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlistItems.has(productId);

    if (isInWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
    updateAppliedFilters();
  }, [selectedSizes, selectedColors, selectedCollections, sortBy, products]);

  // Handle collection parameter from URL
  useEffect(() => {
    if (collectionParam && products.length > 0) {
      // Map navigation names to actual category names
      const collectionMapping = {
        'women': ['Women', 'Ladies', 'Female'],
        'coord-set': ['Coord Set', 'Coordinate Set', 'Matching Set'],
        'kurti': ['Kurti', 'Kurtas', 'Kurta'],
        'shirts': ['Shirts', 'Shirt', 'Formal Shirt', 'Casual Shirt']
      };

      const targetCollection = collectionMapping[collectionParam.toLowerCase()];
      if (targetCollection) {
        // Find matching categories from available products
        const availableCategories = getUniqueCategories();
        const matchingCategory = availableCategories.find(category =>
          targetCollection.some(target =>
            category.toLowerCase().includes(target.toLowerCase()) ||
            target.toLowerCase().includes(category.toLowerCase())
          )
        );

        if (matchingCategory) {
          // Clear all other collections and set only the current one
          setSelectedCollections([matchingCategory]);
          // Also open the collection section for better UX
          setExpandedSections(prev => ({
            ...prev,
            collection: true
          }));
        }
      }
    } else if (!collectionParam && products.length > 0) {
      // If no collection parameter, clear all collection filters
      setSelectedCollections([]);
    }
  }, [collectionParam, products]);

  // Fetch wishlist status when filtered products change
  useEffect(() => {
    if (filteredProducts.length > 0) {
      fetchWishlistStatus();
    }
  }, [filteredProducts, isAuthenticated]);

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Dark Blue', hex: '#00008B' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Light Blue', hex: '#87CEEB' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'White', hex: '#FFFFFF' }
  ];

  // Dynamic filter options based on actual product data
  const getUniqueSizes = () => {
    const sizes = new Set();
    products.forEach(product => {
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(sizeObj => {
          if (sizeObj && sizeObj.size) {
            sizes.add(sizeObj.size);
          }
        });
      }
    });
    return Array.from(sizes).sort();
  };


  const getUniqueCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      if (product.category_name) {
        categories.add(product.category_name);
      }
      if (product.subcategory_name) {
        categories.add(product.subcategory_name);
      }
    });
    return Array.from(categories).sort();
  };

  const getUniqueColors = () => {
    const colors = new Set();
    products.forEach(product => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => {
          if (color && color.color_name) {
            colors.add(color.color_name);
          }
        });
      }
    });
    return Array.from(colors).sort();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const removeFilter = (filterToRemove) => {
    setAppliedFilters(appliedFilters.filter(filter => filter !== filterToRemove));

    // Also remove from specific filter states
    if (getUniqueSizes().includes(filterToRemove)) {
      setSelectedSizes(prev => prev.filter(size => size !== filterToRemove));
    }
    if (colors.map(c => c.name).includes(filterToRemove)) {
      setSelectedColors(prev => prev.filter(color => color !== filterToRemove));
    }
    if (getUniqueCategories().includes(filterToRemove)) {
      setSelectedCollections(prev => {
        const newCollections = prev.filter(collection => collection !== filterToRemove);

        // Update URL based on remaining collections
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (newCollections.length === 0) {
          newSearchParams.delete('collection');
        } else {
          // Map collection name back to URL parameter
          const collectionToParam = {
            'Women': 'women',
            'Ladies': 'women',
            'Female': 'women',
            'Coord Set': 'coord-set',
            'Coordinate Set': 'coord-set',
            'Matching Set': 'coord-set',
            'Kurti': 'kurti',
            'Kurtas': 'kurti',
            'Kurta': 'kurti',
            'Shirts': 'shirts',
            'Shirt': 'shirts',
            'Formal Shirt': 'shirts',
            'Casual Shirt': 'shirts'
          };

          const firstCollection = newCollections[0];
          const paramValue = collectionToParam[firstCollection] || firstCollection.toLowerCase().replace(/\s+/g, '-');
          newSearchParams.set('collection', paramValue);
        }

        const newUrl = `${pathname}?${newSearchParams.toString()}`;
        router.replace(newUrl);

        return newCollections;
      });
    }
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCollections([]);
    setSortBy('featured');

    // Clear URL parameters
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('collection');
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    router.replace(newUrl);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      return newSizes;
    });
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color];
      return newColors;
    });
  };

  const handleCollectionToggle = (collection) => {
    setSelectedCollections(prev => {
      const newCollections = prev.includes(collection)
        ? prev.filter(c => c !== collection)
        : [...prev, collection];

      // Update URL to reflect the new collection state
      const newSearchParams = new URLSearchParams(location.search);

      // If no collections selected, remove collection param
      if (newCollections.length === 0) {
        newSearchParams.delete('collection');
      } else {
        // Map collection name back to URL parameter
        const collectionToParam = {
          'Women': 'women',
          'Ladies': 'women',
          'Female': 'women',
          'Coord Set': 'coord-set',
          'Coordinate Set': 'coord-set',
          'Matching Set': 'coord-set',
          'Kurti': 'kurti',
          'Kurtas': 'kurti',
          'Kurta': 'kurti',
          'Shirts': 'shirts',
          'Shirt': 'shirts',
          'Formal Shirt': 'shirts',
          'Casual Shirt': 'shirts'
        };

        // Use the first collection's parameter
        const firstCollection = newCollections[0];
        const paramValue = collectionToParam[firstCollection] || firstCollection.toLowerCase().replace(/\s+/g, '-');
        newSearchParams.set('collection', paramValue);
      }

      // Update URL without page reload
      const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
      window.history.replaceState({}, '', newUrl);

      return newCollections;
    });
  };


  // Handle product color selection
  const handleProductColorSelect = (productId, colorIndex) => {
    setSelectedProductColors(prev => ({
      ...prev,
      [productId]: colorIndex
    }));
  };

  // Get current image for product
  const getCurrentImage = (product) => {
    if (!product.colors || product.colors.length === 0) {
      return 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';
    }

    const selectedColorIndex = selectedProductColors[product.product_id] || 0;
    const selectedColor = product.colors[selectedColorIndex];

    if (selectedColor && selectedColor.images && selectedColor.images.length > 0) {
      return `${API_URL.replace('/api', '')}${selectedColor.images[0]}`;
    }

    return 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop';
  };

  // Handle Load More
  const handleLoadMore = () => {
    setVisibleProducts(prev => Math.min(prev + 6, filteredProducts.length));
  };

  // Get products to display
  const productsToShow = filteredProducts.slice(0, visibleProducts);

  // Handle mobile filter modal
  const openMobileFilter = () => {
    setIsMobileFilterOpen(true);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  const applyMobileFilters = () => {
    setIsMobileFilterOpen(false);
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Check if product is new (created within last 30 days)
  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.has(productId);
  };

  if (loading) {
    return (
      <div className="shop-skeleton-container">
        <div className="shop-breadcrumb">
          <span>Home / Shop All</span>
        </div>
        <div className="shop-hero-banner" style={{ position: 'relative', width: '100%', height: '300px' }}>
          <Image src={shopBanner} alt="Shop Banner" className="shop-banner-image" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="shop-skeleton-content">
          {/* Left Sidebar Skeleton */}
          <div className="shop-skeleton-sidebar">
            <div className="shop-skeleton-filter-section">
              <div className="shop-skeleton-filter-header"></div>
              <div className="shop-skeleton-filter-option"></div>
              <div className="shop-skeleton-filter-option short"></div>
              <div className="shop-skeleton-filter-option medium"></div>
              <div className="shop-skeleton-filter-option"></div>
            </div>

            <div className="shop-skeleton-filter-section">
              <div className="shop-skeleton-filter-header"></div>
              <div className="shop-skeleton-filter-option"></div>
              <div className="shop-skeleton-filter-option short"></div>
              <div className="shop-skeleton-filter-option"></div>
            </div>

            <div className="shop-skeleton-filter-section">
              <div className="shop-skeleton-filter-header"></div>
              <div className="shop-skeleton-filter-option"></div>
              <div className="shop-skeleton-filter-option medium"></div>
              <div className="shop-skeleton-filter-option short"></div>
            </div>

            <div className="shop-skeleton-filter-section">
              <div className="shop-skeleton-filter-header"></div>
              <div className="shop-skeleton-filter-option"></div>
              <div className="shop-skeleton-filter-option"></div>
              <div className="shop-skeleton-filter-option short"></div>
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="shop-skeleton-main">
            <div className="shop-skeleton-header">
              <div className="shop-skeleton-title"></div>
              <div className="shop-skeleton-sort"></div>
            </div>

            <div className="shop-skeleton-products-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="shop-skeleton-product-card">
                  <div className="shop-skeleton-product-image"></div>
                  <div className="shop-skeleton-product-content">
                    <div className="shop-skeleton-product-title"></div>
                    <div className="shop-skeleton-product-price"></div>
                    <div className="shop-skeleton-product-actions">
                      <div className="shop-skeleton-button primary"></div>
                      <div className="shop-skeleton-button secondary"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator */}
            <div className="shop-skeleton-loading-dots">
              <div className="shop-skeleton-dot"></div>
              <div className="shop-skeleton-dot"></div>
              <div className="shop-skeleton-dot"></div>
            </div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '1rem 0' }}>
              Loading products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <div className="shop-breadcrumb">
          <span>Home / Shop All</span>
        </div>
        <div className="shop-hero-banner" style={{ position: 'relative', width: '100%', height: '300px' }}>
          <Image src={shopBanner} alt="Shop Banner" className="shop-banner-image" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="shop-hero-banner-mobile" style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image src={shopBannerMobile} alt="Shop Banner" className="shop-banner-image" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="shop-content">
          <div className="shop-products-section">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">

      {/* Hero Banner */}
      <div className="shop-hero-banner" style={{ position: 'relative', width: '100%', height: '300px' }}>
        <Image src={shopBanner} alt="Shop Banner" className="shop-banner-image" fill style={{ objectFit: 'cover' }} />
      </div>
      <div className="shop-hero-banner-mobile" style={{ position: 'relative', width: '100%', height: '200px' }}>
        <Image src={shopBannerMobile} alt="Shop Banner" className="shop-banner-image" fill style={{ objectFit: 'cover' }} />
      </div>
      
      {/* SEO H1 */}
      <h1 style={{ position: 'absolute', left: '-9999px' }}>
        Shop Premium Marble Idols, Temple Designs & Sacred Art from Mateshwari Moorti Bhandar
      </h1>
      
      <div className="shop-content">
        {/* Mobile Filter Button */}
        <div className="shop-mobile-filter-button" onClick={openMobileFilter}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4H21V6.172L13.172 14H11V16H9V14H6.828L3 10.172V4Z" fill="currentColor" />
            <path d="M21 20V17.828L17.172 14H15V16H13V14H10.828L7 10.172V8H5V10.172L8.828 14H11V16H13V14H15.172L19 17.828V20H21Z" fill="currentColor" />
          </svg>
          <span>Filter</span>
        </div>

        {/* Filters Sidebar - Desktop */}
        <div className="shop-filters-sidebar shop-desktop-only">
          <div className="shop-filters-section">
            <h3>Filters</h3>

            {/* Applied Filters */}
            {appliedFilters.length > 0 && (
              <div className="shop-applied-filters">
                <h4>Applied Filters</h4>
                <div className="shop-filter-tags">
                  {appliedFilters.map((filter, index) => (
                    <span key={index} className="shop-filter-tag">
                      {filter}
                      <button
                        onClick={() => removeFilter(filter)}
                        className="shop-remove-filter"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button onClick={clearAllFilters} className="shop-clear-all">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Sort By */}
            <div className="shop-filter-section">
              <div
                className="shop-filter-header"
                onClick={() => toggleSection('sortBy')}
              >
                <h4>Sort By</h4>
                <span className="shop-toggle-icon">
                  {expandedSections.sortBy ? '–' : '+'}
                </span>
              </div>
              {expandedSections.sortBy && (
                <div className="shop-filter-content">
                  <div className="shop-radio-group">
                    {[
                      { value: 'featured', label: 'Featured' },
                      { value: 'best_seller', label: 'Best Seller' },
                      { value: 'price_low_high', label: 'Price Low To High' },
                      { value: 'price_high_low', label: 'Price High To Low' }
                    ].map((option) => (
                      <label key={option.value} className="shop-radio-label">
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                        />
                        <span className="shop-radio-text">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Size */}
            <div className="shop-filter-section">
              <div
                className="shop-filter-header"
                onClick={() => toggleSection('size')}
              >
                <h4>Size</h4>
                <span className="shop-toggle-icon">
                  {expandedSections.size ? '–' : '+'}
                </span>
              </div>
              {expandedSections.size && (
                <div className="shop-filter-content">
                  <div className="shop-checkbox-group">
                    {getUniqueSizes().map((size) => (
                      <label key={size} className="shop-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        />
                        <span className="shop-checkbox-text">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color */}
            <div className="shop-filter-section">
              <div
                className="shop-filter-header"
                onClick={() => toggleSection('color')}
              >
                <h4>Color</h4>
                <span className="shop-toggle-icon">
                  {expandedSections.color ? '–' : '+'}
                </span>
              </div>
              {expandedSections.color && (
                <div className="shop-filter-content">
                  <div className="shop-color-group">
                    {colors.map((color) => (
                      <label key={color.name} className="shop-color-label">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color.name)}
                          onChange={() => handleColorToggle(color.name)}
                        />
                        <div
                          className="shop-color-swatch"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <span className="shop-color-text">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Collection */}
            <div className="shop-filter-section">
              <div
                className="shop-filter-header"
                onClick={() => toggleSection('collection')}
              >
                <h4>Collection</h4>
                <span className="shop-toggle-icon">
                  {expandedSections.collection ? '–' : '+'}
                </span>
              </div>
              {expandedSections.collection && (
                <div className="shop-filter-content">
                  <div className="shop-checkbox-group">
                    {/* Category Options */}
                    {getUniqueCategories().map((category) => (
                      <label key={category} className="shop-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedCollections.includes(category)}
                          onChange={() => handleCollectionToggle(category)}
                        />
                        <span className="shop-checkbox-text">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Products Section */}
        <div className="shop-products-section">
          {/* Search Results Header */}
          {searchQuery && (
            <div className="shop-search-results-header">
              <h2>Search Results for &quot;{searchQuery}&quot;</h2>
              <p>Found {filteredProducts.length} products</p>
              <button
                className="shop-clear-search-btn"
                onClick={() => router.push('/shop')}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Show filtered results count */}
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Showing {productsToShow.length} of {filteredProducts.length} products
            {appliedFilters.length > 0 && ` (${appliedFilters.length} filters applied)`}
          </div>

          {/* First 6 products */}
          <div className="shop-products-grid">
            {productsToShow.slice(0, 6).map((product, index) => (
              <div
                key={product.product_id}
                className="shop-product-card"
                onClick={() => handleProductClick(product.product_id)}
              >
                <div className="shop-product-image-container" style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
                  <Image src={getCurrentImage(product)} alt={product.name} className="shop-product-image" fill style={{ objectFit: 'cover' }} />
                  {isNewProduct(product.created_at) && <span className="shop-new-tag">New</span>}
                  <button
                    className={`shop-heart-btn ${isInWishlist(product.product_id) ? 'shop-heart-btn-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.product_id);
                    }}
                    disabled={wishlistLoading[product.product_id]}
                  >
                    {wishlistLoading[product.product_id] ? (
                      <div className="shop-heart-loading">...</div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.product_id) ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="shop-product-content">
                  <h3 className="shop-product-name">{product.name}</h3>
                  <p className="shop-product-description">{product.description}</p>
                  <div className="shop-product-price-colors">
                    <span className="shop-product-price">
                      {product.min_price ? formatPrice(product.min_price) : 'Price not available'}
                    </span>
                    <div className="shop-product-color-swatches">
                      {product.colors && product.colors.map((colorData, colorIndex) => (
                        <div
                          key={colorIndex}
                          className={`shop-product-color-swatch ${selectedProductColors[product.product_id] === colorIndex ? 'shop-product-color-swatch-active' : ''}`}
                          style={{ backgroundColor: colorData.color_code || '#000000' }}
                          title={colorData.color_name}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductColorSelect(product.product_id, colorIndex);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className="shop-mid-banner" style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Image
              src={shopBanner}
              alt="Shop Banner"
              className="shop-mid-banner-img"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* 6 products below banner (by default) */}
          <div className="shop-products-grid">
            {productsToShow.slice(6, 12).map((product, index) => (
              <div
                key={product.product_id}
                className="shop-product-card"
                onClick={() => handleProductClick(product.product_id)}
              >
                <div className="shop-product-image-container" style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
                  <Image src={getCurrentImage(product)} alt={product.name} className="shop-product-image" fill style={{ objectFit: 'cover' }} />
                  {isNewProduct(product.created_at) && <span className="shop-new-tag">New</span>}
                  <button
                    className={`shop-heart-btn ${isInWishlist(product.product_id) ? 'shop-heart-btn-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.product_id);
                    }}
                    disabled={wishlistLoading[product.product_id]}
                  >
                    {wishlistLoading[product.product_id] ? (
                      <div className="shop-heart-loading">...</div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.product_id) ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="shop-product-content">
                  <h3 className="shop-product-name">{product.name}</h3>
                  <p className="shop-product-description">{product.description}</p>
                  <div className="shop-product-price-colors">
                    <span className="shop-product-price">
                      {product.min_price ? formatPrice(product.min_price) : 'Price not available'}
                    </span>
                    <div className="shop-product-color-swatches">
                      {product.colors && product.colors.map((colorData, colorIndex) => (
                        <div
                          key={colorIndex}
                          className={`shop-product-color-swatch ${selectedProductColors[product.product_id] === colorIndex ? 'shop-product-color-swatch-active' : ''}`}
                          style={{ backgroundColor: colorData.color_code || '#000000' }}
                          title={colorData.color_name}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductColorSelect(product.product_id, colorIndex);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional products (after Load More) */}
          {productsToShow.length > 12 && (
            <div className="shop-products-grid">
              {productsToShow.slice(12).map((product, index) => (
                <div
                  key={product.product_id}
                  className="shop-product-card"
                  onClick={() => handleProductClick(product.product_id)}
                >
                  <div className="shop-product-image-container" style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
                    <Image src={getCurrentImage(product)} alt={product.name} className="shop-product-image" fill style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }} />
                    {isNewProduct(product.created_at) && <span className="shop-new-tag">New</span>}
                    <button
                      className={`shop-heart-btn ${isInWishlist(product.product_id) ? 'shop-heart-btn-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.product_id);
                      }}
                      disabled={wishlistLoading[product.product_id]}
                    >
                      {wishlistLoading[product.product_id] ? (
                        <div className="shop-heart-loading">...</div>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.product_id) ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="shop-product-content">
                    <h3 className="shop-product-name">{product.name}</h3>
                    <p className="shop-product-description">{product.description}</p>
                    <div className="shop-product-price-colors">
                      <span className="shop-product-price">
                        {product.min_price ? formatPrice(product.min_price) : 'Price not available'}
                      </span>
                      <div className="shop-product-color-swatches">
                        {product.colors && product.colors.map((colorData, colorIndex) => (
                          <div
                            key={colorIndex}
                            className={`shop-product-color-swatch ${selectedProductColors[product.product_id] === colorIndex ? 'shop-product-color-swatch-active' : ''}`}
                            style={{ backgroundColor: colorData.color_code || '#000000' }}
                            title={colorData.color_name}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductColorSelect(product.product_id, colorIndex);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleProducts < filteredProducts.length && (
            <div className="shop-load-more-container">
              <button className="shop-load-more-btn" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}

          {/* No products found message */}
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search criteria.</p>
              <button
                onClick={clearAllFilters}
                style={{
                  background: '#B68126',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="shop-mobile-filter-overlay" onClick={closeMobileFilter}>
          <div className="shop-mobile-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shop-mobile-filter-header">
              <h3>Filters</h3>
              <button className="shop-mobile-filter-close" onClick={closeMobileFilter}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="shop-mobile-filter-content">
              {/* Sort By */}
              <div className="shop-mobile-filter-section">
                <div
                  className="shop-mobile-filter-header-btn"
                  onClick={() => toggleSection('sortBy')}
                >
                  <span>Sort By</span>
                  <span className="shop-mobile-toggle-icon">
                    {expandedSections.sortBy ? '–' : '+'}
                  </span>
                </div>
                {expandedSections.sortBy && (
                  <div className="shop-mobile-filter-options">
                    <div className="shop-radio-group">
                      {[
                        { value: 'featured', label: 'Featured' },
                        { value: 'best_seller', label: 'Best Seller' },
                        { value: 'price_low_high', label: 'Price Low To High' },
                        { value: 'price_high_low', label: 'Price High To Low' }
                      ].map((option) => (
                        <label key={option.value} className="shop-radio-label">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value)}
                          />
                          <span className="shop-radio-text">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Size */}
              <div className="shop-mobile-filter-section">
                <div
                  className="shop-mobile-filter-header-btn"
                  onClick={() => toggleSection('size')}
                >
                  <span>Size</span>
                  <span className="shop-mobile-toggle-icon">
                    {expandedSections.size ? '–' : '+'}
                  </span>
                </div>
                {expandedSections.size && (
                  <div className="shop-mobile-filter-options">
                    <div className="shop-checkbox-group">
                      {getUniqueSizes().map((size) => (
                        <label key={size} className="shop-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => handleSizeToggle(size)}
                          />
                          <span className="shop-checkbox-text">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="shop-mobile-filter-section">
                <div
                  className="shop-mobile-filter-header-btn"
                  onClick={() => toggleSection('color')}
                >
                  <span>Color</span>
                  <span className="shop-mobile-toggle-icon">
                    {expandedSections.color ? '–' : '+'}
                  </span>
                </div>
                {expandedSections.color && (
                  <div className="shop-mobile-filter-options">
                    <div className="shop-color-group">
                      {colors.map((color) => (
                        <label key={color.name} className="shop-color-label">
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color.name)}
                            onChange={() => handleColorToggle(color.name)}
                          />
                          <div
                            className="shop-color-swatch"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="shop-color-text">{color.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Collection */}
              <div className="shop-mobile-filter-section">
                <div
                  className="shop-mobile-filter-header-btn"
                  onClick={() => toggleSection('collection')}
                >
                  <span>Collection</span>
                  <span className="shop-mobile-toggle-icon">
                    {expandedSections.collection ? '–' : '+'}
                  </span>
                </div>
                {expandedSections.collection && (
                  <div className="shop-mobile-filter-options">
                    <div className="shop-checkbox-group">
                      {/* Category Options */}
                      {getUniqueCategories().map((category) => (
                        <label key={category} className="shop-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedCollections.includes(category)}
                            onChange={() => handleCollectionToggle(category)}
                          />
                          <span className="shop-checkbox-text">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="shop-mobile-filter-actions">
              <button className="shop-mobile-clear-filter" onClick={clearAllFilters}>
                Clear Filter
              </button>
              <button className="shop-mobile-apply-filter" onClick={applyMobileFilters}>
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
