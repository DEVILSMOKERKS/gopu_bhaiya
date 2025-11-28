import React from 'react';
import './CustomTempleProjects.css';
// Import background images - Update these paths when images are available
import customProjectsBgDesktop from '../../../assets/Images/banner/customProjectsBgDesktop.jpg';
import customProjectsBgMobile from '../../../assets/Images/banner/customProjectsBgMobile.jpg';

const CustomTempleProjects = () => {
  const stats = [
    { number: '97+', label: 'Cities' },
    { number: '999+', label: 'Project' },
    { number: '50+', label: 'Years Of Experience' }
  ];

  const sectionStyle = {
    '--desktop-bg': customProjectsBgDesktop ? `url(${customProjectsBgDesktop})` : 'none',
    '--mobile-bg': customProjectsBgMobile ? `url(${customProjectsBgMobile})` : 'none'
  };

  return (
    <section className="custom-temple-projects" style={sectionStyle}>
      <div className="custom-temple-projects-container">
        <h2 className="custom-temple-projects-title">Our Custom Completed Projects</h2>
        <p className="custom-temple-projects-subtitle">Crafted With Creativity, Built With Excellence</p>
        <div className="custom-temple-projects-stats">
          {stats.map((stat, index) => (
            <div key={index} className="custom-temple-projects-stat-card">
              <div className="custom-temple-projects-stat-number">{stat.number}</div>
              <div className="custom-temple-projects-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomTempleProjects;

