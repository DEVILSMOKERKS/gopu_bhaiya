import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OurBlogs.css';

const OurBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
    if (blog.image) {
      return `${API_URL.replace('/api', '')}${blog.image}`;
    }
    return 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Blog+Post';
  };

  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  if (loading) {
    return (
      <section className="our-blogs">
        <div className="container">
          <h2 className="section-title">Our Blogs</h2>
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="our-blogs">
      <div className="container">
        <h2 className="section-title">Our Blogs</h2>
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div 
              key={blog.blog_id} 
              className="blog-card"
              onClick={() => handleBlogClick(blog.slug)}
            >
              <div className="blog-image-wrapper">
                <img 
                  src={getBlogImage(blog)} 
                  alt={blog.title}
                  className="blog-image"
                />
              </div>
              <div className="blog-content">
                <h3 className="blog-title">{blog.title}</h3>
                {blog.excerpt && (
                  <p className="blog-excerpt">{blog.excerpt}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBlogs;

