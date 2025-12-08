'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { HiUser } from 'react-icons/hi';
import './homeblog.css';

const HomeBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs?limit=3`);

      if (response.data.success) {
        setBlogPosts(response.data.data);
      } else {
        setError('Failed to fetch blog posts');
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };


  const handleCardClick = (slug) => {
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

  if (loading) {
    return (
      <section className="homeblog">
        <div className="homeblog-header">
          <h2 className="homeblog-title">Our Blogs</h2>
          <Link href="/blogs" className="homeblog-view-all">View All</Link>
        </div>
        <div className="homeblog-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="homeblog-card homeblog-skeleton">
              <div className="homeblog-skeleton-image"></div>
              <div className="homeblog-content">
                <div className="homeblog-skeleton-title"></div>
                <div className="homeblog-skeleton-excerpt"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="homeblog">
        <div className="homeblog-header">
          <h2 className="homeblog-title">Our Blogs</h2>
          <Link href="/blogs" className="homeblog-view-all">View All</Link>
        </div>
        <div className="homeblog-error">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="homeblog">
      <div className="homeblog-header">
        <h2 className="homeblog-title">Our Blogs</h2>
        <Link href="/blogs" className="homeblog-view-all">
          View All
        </Link>
      </div>

      <div className="homeblog-grid">
        {blogPosts.map((post) => (
          <div
            key={post.blog_id}
            className="homeblog-card"
            onClick={() => handleCardClick(post.slug)}
          >
            <div className="homeblog-image-wrapper" style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden', background: '#f5f5f5' }}>
              <Image
                src={`${API_URL.replace('/api', '')}${post.featured_image}`}
                alt={post.title}
                className="homeblog-image"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="homeblog-content">
              <div className="homeblog-meta">
                <span className="homeblog-date">{formatDate(post.created_at)}</span>
              </div>
              <h3 className="homeblog-card-title">
                {post.title}
              </h3>
              <div className="homeblog-author">
                {post.author_photo ? (
                  <img
                    src={post.author_photo}
                    alt={post.author_name}
                    className="homeblog-author-photo"
                  />
                ) : (
                  <div className="homeblog-author-icon">
                    <HiUser />
                  </div>
                )}
                <span className="homeblog-author-name">{post.author_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeBlog;
