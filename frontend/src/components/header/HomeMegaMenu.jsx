import React from 'react';
import { Link } from 'react-router-dom';
import './HomeMegaMenu.css';

const HomeMegaMenu = ({ isOpen, onMouseLeave }) => {
  const menuItems = [
    {
      id: 'about-us',
      title: 'About Us',
      link: '/About-us'
    },
    {
      id: 'experience-centre',
      title: 'Experience Centre',
      link: '/experience-centre'
    },
    {
      id: 'the-team',
      title: 'The Team',
      link: '/the-team'
    },
    {
      id: 'careers',
      title: 'Careers',
      link: '/careers'
    },
    {
      id: 'artisans',
      title: 'Artisans of Tilak',
      link: '/artisans'
    },
    {
      id: 'collaborations',
      title: 'Collaborations',
      link: '/collaborations'
    },
    {
      id: 'our-clients',
      title: 'Our Clients',
      link: '/our-clients'
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
            <Link to={item.link} className="home-megamenu-link">
              {item.title.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeMegaMenu;

