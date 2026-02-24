'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './OurBlogs.css';

const OurBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs?limit=3`);
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBlogImage = (blog) => {
    const img = blog.featured_image || blog.image;
    if (img) {
      const base = API_URL ? API_URL.replace('/api', '') : '';
      return `${base}${img}`;
    }
    return '';
  };

  const handleBlogClick = (slug) => {
    router.push(`/blog/${slug}`);
  };

  if (loading) {
    return (
      <section className="our-blogs">
        <div className="our-blogs-container">
          <div className="our-blogs-header">
            <h2 className="our-blogs-title">Our Blogs</h2>
            <a href="/blogs" className="our-blogs-view-all">View All</a>
          </div>
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  // Limit to 3 blogs
  let displayBlogs = blogs.slice(0, 3);

  return (
    <section className="our-blogs">
      <div className="our-blogs-container">
        <div className="our-blogs-header">
          <h2 className="our-blogs-title">Our Blogs</h2>
          {displayBlogs.length > 0 && (
            <a href="/blogs" className="our-blogs-view-all">View All</a>
          )}
        </div>
        {displayBlogs.length > 0 ? (
          <div className="our-blogs-grid">
            {displayBlogs.map((blog, index) => (
              <div
                key={blog.blog_id || blog.slug || index}
                className="our-blogs-card"
                onClick={() => handleBlogClick(blog.slug)}
              >
                <div className="our-blogs-image-wrapper" style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden', background: '#f5f5f5' }}>
                  {getBlogImage(blog) ? (
                    <Image
                      src={getBlogImage(blog)}
                      alt={blog.title}
                      className="our-blogs-image"
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                  ) : (
                    <div className="our-blogs-placeholder">
                      {blog.title}
                    </div>
                  )}
                </div>
                <div className="our-blogs-content">
                  <h3 className="our-blogs-card-title">{blog.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="our-blogs-empty">
            <div className="our-blogs-empty-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z"
                  fill="#B68126"
                  fillOpacity="0.3"
                />
              </svg>
            </div>
            <h3 className="our-blogs-empty-title">No Blogs Available</h3>
            <p className="our-blogs-empty-text">
              We&apos;re working on creating amazing content for you. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurBlogs;

