import React from 'react';
import './ManufacturingProcess.css';

const ManufacturingProcess = () => {
  const processImages = [
    { src: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Craftsman+1', alt: 'Craftsman carving statue' },
    { src: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Craftsman+2', alt: 'Partially carved statue' },
    { src: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Craftsman+3', alt: 'Craftsman working on marble' },
    { src: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Craftsman+4', alt: 'Marble carving process' },
    { src: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Craftsman+5', alt: 'Detailed carving work' },
    { src: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Craftsman+6', alt: 'Master craftsman at work' }
  ];

  return (
    <section className="manufacturing-process">
      <div className="container">
        <h2 className="section-title">Manufactures in Mpoon</h2>
        <div className="process-grid">
          {processImages.map((image, index) => (
            <div key={index} className="process-image-card">
              <img 
                src={image.src} 
                alt={image.alt}
                className="process-image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingProcess;

