import React from 'react';
import './FollowUs.css';
// Premium main image: use temple/murti craftsmanship. For custom WEBP, place at public/images/follow-us-premium-temple-craftsmanship.webp
import Follow1Main from '../../../assets/Images/banner/instaImage.png';
import Follow2 from '../../../assets/Images/insta/img4.jpeg';
import Follow3 from '../../../assets/Images/insta/img3.jpeg';
import Follow4 from '../../../assets/Images/insta/img2.jpeg';
import Follow5 from '../../../assets/Images/insta/img.jpeg';
import Image from 'next/image';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/mateshwarimoortibhandar/',
    ariaLabel: 'Follow Welcome To Mateshwari Moorti Bhanda on Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849C2.197 3.924 3.744 2.312 7 2.163c1.266-.058 1.645-.07 4.849-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/mateshwarimoortibhandar',
    ariaLabel: 'Follow Welcome To Mateshwari Moorti Bhanda on Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@mateshwarimoortibhandar',
    ariaLabel: 'Subscribe to Welcome To Mateshwari Moorti Bhanda on YouTube',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const FollowUs = () => {
  const followImages = [
    { id: 2, src: Follow2, alt: 'Saraswati Murti' },
    { id: 3, src: Follow3, alt: 'Ganesha Murti' },
    { id: 4, src: Follow4, alt: 'Marble Home Temple' },
    { id: 5, src: Follow5, alt: 'Marble Home Temple' }  
  ];

  return (  
    <section className="follow-us">
      <div className="follow-us-container">

        <a href="https://www.instagram.com/reel/DVA2HgUknfx/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer" className="follow-us-title-link">
          <h2 className="follow-us-title">Follow Us @mateshwarimoortibhandar</h2>
        </a>
        {/* <div className="follow-us-social-row">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="follow-us-social-icon"
              aria-label={social.ariaLabel}
            >
              {social.icon}
            </a>
          ))}
        </div> */}
        <div className="follow-us-grid">
          {/* Large left image — premium temple/murti craftsmanship, soft overlay */}
          <div className="follow-us-main-image" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1' }}>
            <Image
              src={Follow1Main}
              alt="Handcrafted marble temple and murti craftsmanship at Welcome To Mateshwari Moorti Bhanda"
              className="follow-us-image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="follow-us-main-image-overlay" aria-hidden="true" />
          </div>

          {/* 2x2 Grid for right side (desktop) / bottom (mobile) */}
          <div className="follow-us-grid-right">
            {followImages.map((image) => (
              <div key={image.id} className="follow-us-image-card" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1' }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="follow-us-image"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FollowUs;

