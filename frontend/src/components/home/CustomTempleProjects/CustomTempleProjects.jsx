import React from 'react';
import './CustomTempleProjects.css';

const CustomTempleProjects = () => {
  const stats = [
    { number: '97+', label: 'Custom Temples' },
    { number: '999+', label: 'Idols' },
    { number: '50+', label: 'Countries Exported To' }
  ];

  const projectImages = [
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Temple+1', alt: 'Custom Temple Project' },
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Temple+2', alt: 'Temple Installation' },
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Idol+1', alt: 'Handcrafted Idol' },
    { src: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Idol+2', alt: 'Marble Statue' }
  ];

  return (
    <section className="custom-temple-projects">
      <div className="projects-background">
        <div className="container">
          <h2 className="section-title">Our Custom Temple and Projects</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="projects-grid">
            {projectImages.map((image, index) => (
              <div key={index} className="project-image-card">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="project-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomTempleProjects;

