'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './BlogDetail.css';

const BlogDetail = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs/${slug}`);

      if (response.data.success) {
        setBlog(response.data.data);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleRelatedBlogClick = (relatedSlug) => {
    router.push(`/blog/${relatedSlug}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-skeleton">
          <div className="blog-detail-skeleton-header">
            <div className="blog-detail-skeleton-title"></div>
            <div className="blog-detail-skeleton-meta"></div>
          </div>
          <div className="blog-detail-skeleton-image"></div>
          <div className="blog-detail-skeleton-content">
            <div className="blog-detail-skeleton-paragraph"></div>
            <div className="blog-detail-skeleton-paragraph"></div>
            <div className="blog-detail-skeleton-paragraph"></div>
            <div className="blog-detail-skeleton-paragraph"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-error">
          <h2>Blog Not Found</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/blogs')} className="back-to-blogs-button">
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <article className="blog-detail-main">
          <header className="blog-detail-header">
            <div className="blog-detail-meta">
              <span className="blog-detail-date">{formatDate(blog.created_at)}</span>
              <span className="blog-detail-reading-time">
                {formatReadingTime(blog.content)} min read
              </span>
            </div>

            <h1 className="blog-detail-title">{blog.title}</h1>



            <div className="blog-detail-author">
              {blog.author_photo && (
                <Image
                  src={blog.author_photo}
                  alt={blog.author_name}
                  className="blog-detail-author-photo"
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              )}
              <div className="blog-detail-author-info">
                <span className="blog-detail-author-name">{blog.author_name}</span>
                <span className="blog-detail-author-role">Author</span>
              </div>
            </div>
          </header>

          {blog.featured_image && (
            <div className="blog-detail-image-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Image
                src={`${API_URL.replace('/api', '')}${blog.featured_image}`}
                alt={blog.title}
                className="blog-detail-image"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-detail-tags">
              <h3>Tags:</h3>
              <div className="blog-detail-tags-list">
                {JSON.parse(blog.tags).map((tag, index) => (
                  <span key={index} className="blog-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {blog.related_blogs && blog.related_blogs.length > 0 && (
          <aside className="blog-detail-sidebar">
            <div className="related-blogs">
              <h3>Related Articles</h3>
              <div className="related-blogs-list">
                {blog.related_blogs.map((relatedBlog) => (
                  <div
                    key={relatedBlog.blog_id}
                    className="related-blog-card"
                    onClick={() => handleRelatedBlogClick(relatedBlog.slug)}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '150px', overflow: 'hidden' }}>
                      <Image
                        src={`${API_URL.replace('/api', '')}${relatedBlog.featured_image}`}
                        alt={relatedBlog.title}
                        className="related-blog-image"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="related-blog-content">
                      <h4 className="related-blog-title">{relatedBlog.title}</h4>

                      <span className="related-blog-date">{formatDate(relatedBlog.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="blog-detail-footer">
        <button onClick={() => router.push('/blogs')} className="back-to-blogs-button">
          ← Back to All Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
