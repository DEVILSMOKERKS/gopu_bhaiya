'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './Collection.css';
import Collection1 from '../../assets/Images/collection/collection1.jpg'
import Collection2 from '../../assets/Images/collection/collection4.jpg'
import Collection4 from '../../assets/Images/collection/collection2.jpg'
import Collection3 from '../../assets/Images/collection/collection3.jpg'
import Image from 'next/image';

const Collection = () => {
  const router = useRouter();

  const handleCollectionClick = () => {
    router.push('/shop');
  };

  return (
    <div className="collection-container">

      <div className="collection-grid">
        <div className="collection-item" onClick={handleCollectionClick} style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={Collection1}
            alt="Navy Blue Dress"
            className="collection-image"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="collection-item" onClick={handleCollectionClick} style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={Collection2}
            alt="Blue Floral Dress"
            className="collection-image"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="collection-item" onClick={handleCollectionClick} style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={Collection3}
            alt="White Embroidered Dress"
            className="collection-image"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="collection-item" onClick={handleCollectionClick} style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={Collection4}
            alt="Green Pattern Dress"
            className="collection-image"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Collection;