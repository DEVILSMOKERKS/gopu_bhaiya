import React from 'react';
import './TrustedClients.css';

const TrustedClients = () => {
  const clientLogos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Client ${i + 1}`,
    logo: `https://via.placeholder.com/150x80/8B4513/FFFFFF?text=Client+${i + 1}`
  }));

  return (
    <section className="trusted-clients">
      <div className="container">
        <h2 className="section-title">Trusted by 1000+ Clients Worldwide</h2>
        <div className="clients-grid">
          {clientLogos.map((client) => (
            <div key={client.id} className="client-logo-card">
              <img 
                src={client.logo} 
                alt={client.name}
                className="client-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;

