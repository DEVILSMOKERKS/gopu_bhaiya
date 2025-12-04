import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Grand Temple Design',
      category: 'temple',
      image: '/placeholder-project.jpg',
      location: 'Jaipur, Rajasthan',
      year: '2024',
      description: 'A magnificent temple design featuring intricate carvings and modern architectural elements.'
    },
    {
      id: 2,
      title: 'Luxury Pooja Room',
      category: 'pooja-room',
      image: '/placeholder-project.jpg',
      location: 'Mumbai, Maharashtra',
      year: '2024',
      description: 'A luxurious pooja room with premium materials and elegant design.'
    },
    {
      id: 3,
      title: 'Traditional Home Temple',
      category: 'temple',
      image: '/placeholder-project.jpg',
      location: 'Delhi, NCR',
      year: '2023',
      description: 'A traditional temple design blending classic aesthetics with contemporary functionality.'
    },
    {
      id: 4,
      title: 'Compact Pooja Corner',
      category: 'pooja-room',
      image: '/placeholder-project.jpg',
      location: 'Bangalore, Karnataka',
      year: '2024',
      description: 'A space-efficient pooja corner perfect for modern apartments.'
    },
    {
      id: 5,
      title: 'Marble Temple Complex',
      category: 'temple',
      image: '/placeholder-project.jpg',
      location: 'Ahmedabad, Gujarat',
      year: '2023',
      description: 'An expansive marble temple complex with multiple shrines and ceremonial spaces.'
    },
    {
      id: 6,
      title: 'Premium Pooja Room',
      category: 'pooja-room',
      image: '/placeholder-project.jpg',
      location: 'Pune, Maharashtra',
      year: '2024',
      description: 'A premium pooja room featuring gold accents and sophisticated design elements.'
    }
  ];

  const categories = ['all', 'temple', 'pooja-room'];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <>
      <Helmet>
        <title>Projects - Mateshwari Exports</title>
        <meta name="description" content="Explore our completed projects showcasing our craftsmanship and design expertise." />
      </Helmet>

      <div className="projects-page">
        <div className="projects-header">
          <h1 className="projects-title h2style">Projects</h1>
          <p className="projects-subtitle">
            Explore our completed projects showcasing excellence in design and craftsmanship
          </p>
        </div>

        <div className="projects-container">
          <div className="projects-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category === 'all' ? 'All Projects' : category.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="project-overlay">
                    <span className="project-category">{project.category.replace('-', ' ').toUpperCase()}</span>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <span className="project-location">📍 {project.location}</span>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <Link to={`/project/${project.id}`} className="project-view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;




