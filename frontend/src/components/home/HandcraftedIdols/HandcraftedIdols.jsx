import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HandcraftedIdols.css';
// Import handcrafted idols images
import radhaKrishna1 from '../../../assets/Images/banner/radhaKrishna1.jpg';
import saraswatiMurti from '../../../assets/Images/banner/saraswatiMurti.jpg';
import marbleMandir from '../../../assets/Images/banner/marbleMandir.jpg';
import radhaKrishna2 from '../../../assets/Images/banner/radhaKrishna2.jpg';

const HandcraftedIdols = () => {
  const navigate = useNavigate();

  const idolsData = [
    {
      id: 1,
      image: radhaKrishna1,
      label: 'Radha Krishna',
      isTall: false
    },
    {
      id: 2,
      image: saraswatiMurti,
      label: 'Saraswati Murti',
      isTall: true
    },
    {
      id: 3,
      image: marbleMandir,
      label: 'Marbel Mandir',
      isTall: false
    },
    {
      id: 4,
      image: radhaKrishna2,
      label: 'Radha Krishna',
      isTall: false
    }
  ];

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="handcrafted-idols">
      <div className="handcrafted-idols-wrapper">
        <h2 className="handcrafted-idols-title">Handcrafted Idols</h2>
        <div className="handcrafted-idols-grid">
          {idolsData.map((idol) => (
            <div
              key={idol.id}
              className={`handcrafted-idol-item ${idol.isTall ? 'tall' : ''}`}
              onClick={() => handleCardClick(idol.id)}
            >
              <img
                src={idol.image}
                alt={idol.label}
                className="handcrafted-idol-image"
              />
              <span className="handcrafted-idol-tag">{idol.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HandcraftedIdols;

                