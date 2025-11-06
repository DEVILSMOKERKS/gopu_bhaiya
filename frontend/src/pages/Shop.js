import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/Products/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    material: '',
    search: searchParams.get('search') || '',
    sortBy: 'createdAt',
    order: 'DESC',
  });

  const dispatch = useDispatch();
  const { products, loading, pagination } = useSelector((state) => state.products);

  useEffect(() => {
    const params = {
      ...filters,
      page: searchParams.get('page') || 1,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, filters, searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setSearchParams({ ...searchParams, [key]: value || '', page: 1 });
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      material: '',
      search: '',
      sortBy: 'createdAt',
      order: 'DESC',
    };
    setFilters(clearedFilters);
    setSearchParams({});
  };

  const categories = ['Temples', 'Idols', 'Decor', 'Custom Orders'];
  const materials = ['Marble', 'Granite', 'Stone', 'Metal'];

  return (
    <>
      <Helmet>
        <title>Shop - Mateshwari Exports</title>
        <meta name="description" content="Browse our collection of premium marble idols and temples" />
      </Helmet>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
              Our Collection
            </h1>
            <p className="text-gray-600">Discover divine craftsmanship</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-heading font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-600"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        placeholder="Min"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        placeholder="Max"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <select
                      value={filters.material}
                      onChange={(e) => handleFilterChange('material', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value="">All Materials</option>
                      {materials.map((mat) => (
                        <option key={mat} value={mat}>
                          {mat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={`${filters.sortBy}-${filters.order}`}
                      onChange={(e) => {
                        const [sortBy, order] = e.target.value.split('-');
                        setFilters({ ...filters, sortBy, order });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value="createdAt-DESC">Newest First</option>
                      <option value="createdAt-ASC">Oldest First</option>
                      <option value="price-ASC">Price: Low to High</option>
                      <option value="price-DESC">Price: High to Low</option>
                      <option value="name-ASC">Name: A to Z</option>
                    </select>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full btn-secondary text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn-secondary flex items-center gap-2"
                >
                  <FiFilter />
                  Filters
                </button>
                {pagination && (
                  <p className="text-gray-600">
                    Showing {products.length} of {pagination.total} products
                  </p>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i + 1 })}
                          className={`px-4 py-2 rounded-lg ${
                            parseInt(searchParams.get('page') || 1) === i + 1
                              ? 'bg-gold-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gold-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;

