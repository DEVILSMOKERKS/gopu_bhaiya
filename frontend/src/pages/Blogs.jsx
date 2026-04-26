'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './Blogs.css';
import { HiUser } from 'react-icons/hi';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, currentSearch]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9
      });

      if (currentSearch) {
        params.append('search', currentSearch);
      }

      const response = await axios.get(`${API_URL}/blogs?${params}`);

      if (response.data.success) {
        setBlogs(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');

    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    newParams.set('page', '1');

    router.push(`/blogs?${newParams.toString()}`);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams();
    if (currentSearch) newParams.set('search', currentSearch);
    newParams.set('page', page.toString());

    router.push(`/blogs?${newParams.toString()}`);
  };

  const handleBlogClick = (slug) => {
    router.push(`/blog/${slug}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    router.push('/blogs?page=1');
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="blogs-page">
        <div className="blogs-header">
          <h1>Our Blog</h1>
          <p>Read practical guides, devotional insights, design ideas, and care tips from the team behind Welcome To Mateshwari Moorti Bhanda.</p>
        </div>
        <div className="blogs-skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="blog-skeleton-card">
              <div className="blog-skeleton-image"></div>
              <div className="blog-skeleton-content">
                <div className="blog-skeleton-title"></div>
                <div className="blog-skeleton-excerpt"></div>
                <div className="blog-skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="blogs-header">
        <h1>Our Blog</h1>
        <p>Read practical guides, devotional insights, design ideas, and care tips from the team behind Welcome To Mateshwari Moorti Bhanda.</p>
      </div>

      <div className="blogs-container">
        <div className="blogs-sidebar">
          <div className="search-section">
            <h3>Search</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                name="search"
                placeholder="Search blogs..."
                defaultValue={currentSearch}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>

          {currentSearch && (
            <div className="clear-filters">
              <button onClick={() => router.push('/blogs')} className="clear-filters-button">
                Clear Search
              </button>
            </div>
          )}
        </div>

        <div className="blogs-main">
          {error && (
            <div className="blogs-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="blogs-empty">
              <h3>No blogs found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}

          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div
                key={blog.blog_id}
                className="blog-card"
                onClick={() => handleBlogClick(blog.slug)}
              >
                <Image
                  src={blog.featured_image ? `${API_URL.replace('/api', '')}${blog.featured_image}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}
                  alt={blog.title}
                  className="blog-image"
                  width={400}
                  height={250}
                  style={{ objectFit: 'cover' }}
                />
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{formatDate(blog.created_at)}</span>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <div className="blog-author">
                    {blog.author_photo ? (
                      <Image
                        src={blog.author_photo}
                        alt={blog.author_name}
                        className="blog-author-photo"
                        width={35}
                        height={35}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      <div className="blog-author-icon">
                        <HiUser />
                      </div>
                    )}
                    <span className="blog-author-name">{blog.author_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.total_pages > 1 && (
            <div className="pagination">
              {pagination.current_page > 1 && (
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className="pagination-button"
                >
                  Previous
                </button>
              )}

              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-button ${page === pagination.current_page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}

              {pagination.current_page < pagination.total_pages && (
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  className="pagination-button"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
