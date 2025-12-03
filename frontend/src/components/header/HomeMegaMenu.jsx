import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeMegaMenu.css';
// Import images
import aboutUsImg from '../../assets/Images/banner/aboutbg.jpg';
import experienceImg from '../../assets/Images/banner/mandir.jpg';
import teamImg from '../../assets/Images/banner/marbleMandir.jpg';
import careersImg from '../../assets/Images/banner/hero-1.jpg';
import artisansImg from '../../assets/Images/banner/radhaKrishna1.jpg';
import collaborationsImg from '../../assets/Images/banner/radhaKrishna2.jpg';
import clientsImg from '../../assets/Images/banner/saraswati.jpg';

const HomeMegaMenu = ({ isOpen, onMouseLeave }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: 'about-us',
      title: 'About Us',
      link: '/About-us',
      image: aboutUsImg
    },
    {
      id: 'experience-centre',
      title: 'Experience Centre',
      link: '/experience-centre',
      image: experienceImg
    },
    {
      id: 'the-team',
      title: 'The Team',
      link: '/the-team',
      image: teamImg
    },
    {
      id: 'careers',
      title: 'Careers',
      link: '/careers',
      image: careersImg
    },
    {
      id: 'artisans',
      title: 'Artisans of Tilak',
      link: '/artisans',
      image: artisansImg
    },
    {
      id: 'collaborations',
      title: 'Collaborations',
      link: '/collaborations',
      image: collaborationsImg
    },
    {
      id: 'our-clients',
      title: 'Our Clients',
      link: '/our-clients',
      image: clientsImg
    }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="home-megamenu"
      onMouseLeave={onMouseLeave}
    >
      <div className="home-megamenu-container">
        {/* Left Sidebar Menu */}
        <div className="home-megamenu-sidebar">
          <ul className="home-megamenu-list">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`home-megamenu-item ${hoveredItem === item.id ? 'active' : ''}`}
                onMouseEnter={() => setHoveredItem(item.id)}
              >
                <Link to={item.link} className="home-megamenu-link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Image Grid (All Images Visible) */}
        <div className="home-megamenu-images">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`home-megamenu-image-item ${hoveredItem === item.id ? 'highlighted' : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to={item.link} className="home-megamenu-image-link">
                <div className="home-megamenu-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="home-megamenu-image"
                  />
                </div>
                <p className="home-megamenu-image-caption">{item.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMegaMenu;

