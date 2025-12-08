'use client';

import React from 'react';
import Link from 'next/link';
import './HomeMegaMenu.css';

const HomeMegaMenu = ({ isOpen, onMouseLeave }) => {
  const menuItems = [
    {
      id: 'about-us',
      title: 'About Us',
      link: '/about-us'
    },
    {
      id: 'projects',
      title: 'Projects',
      link: '/projects'
    },
    {
      id: 'our-creations',
      title: 'Our Creations',
      link: '/our-creations'
    },
    {
      id: 'our-services',
      title: 'Our Services',
      link: '/our-services'
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      link: '/how-to-place-order'
    },
    {
      id: 'blogs',
      title: 'Blog',
      link: '/blogs'
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      link: '/testimonials'
    }
  ];

  if (!isOpen) return null;

  return (
    <div
      className="home-megamenu"
      onMouseLeave={onMouseLeave}
    >
      <ul className="home-megamenu-list">
        {menuItems.map((item) => (
          <li key={item.id} className="home-megamenu-item">
            <Link href={item.link} className="home-megamenu-link">
              {item.title.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeMegaMenu;

