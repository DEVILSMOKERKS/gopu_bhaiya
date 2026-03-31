'use client';

import Link from 'next/link';
import './ShopByDeity.css';

const categories = [
  { icon: '🐘', name: 'Ganesha', count: '124 items', link: '/products' },
  { icon: '🪈', name: 'Radha Krishna', count: '98 items', link: '/products' },
  { icon: '🌸', name: 'Lakshmi', count: '76 items', link: '/products' },
  { icon: '🔱', name: 'Shiva', count: '85 items', link: '/products' },
  { icon: '🐒', name: 'Hanuman', count: '62 items', link: '/products' },
  { icon: '🛕', name: 'Pooja Sets', count: '40 items', link: '/products' },
];

const ShopByDeity = () => {
  // return (
  //   <section className="sbd-section">
  //     <div className="sbd-inner">
  //       <div className="sbd-header">
  //         <div className="sbd-badge">Browse Categories</div>
  //         <h2 className="sbd-title">Shop by <em>Deity</em></h2>
  //         <p className="sbd-sub">Handcrafted sacred idols for every devotional need</p>
  //       </div>
  //       <div className="sbd-grid">
  //         {categories.map((cat, i) => (
  //           <Link href={cat.link} key={i} className="sbd-card">
  //             <div className="sbd-icon">{cat.icon}</div>
  //             <div className="sbd-name">{cat.name}</div>
  //             <div className="sbd-count">{cat.count}</div>
  //           </Link>
  //         ))}
  //       </div>
  //     </div>
  //   </section>
  // );
};

export default ShopByDeity;
