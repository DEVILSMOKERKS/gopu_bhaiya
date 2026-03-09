'use client';

import Link from 'next/link';
import './FeaturedProducts.css';

const products = [
  {
    icon: '🐘',
    badge: 'BESTSELLER',
    badgeColor: null,
    name: 'Siddhivinayak Ganesha',
    material: 'Makrana Marble · 12 Inch',
    oldPrice: '₹18,000',
    price: '₹13,499',
  },
  {
    icon: '🪈',
    badge: 'NEW',
    badgeColor: '#C44',
    name: 'Radha Krishna Pair',
    material: 'Italian Marble · 18 Inch · Gold',
    oldPrice: null,
    price: '₹28,999',
  },
  {
    icon: '🌸',
    badge: '25% OFF',
    badgeColor: null,
    name: 'Mahalakshmi Idol',
    material: 'White Marble · 15 Inch',
    oldPrice: '₹22,000',
    price: '₹16,499',
  },
  {
    icon: '🔱',
    badge: null,
    badgeColor: null,
    name: 'Nataraj Shiva',
    material: 'Black Marble · 24 Inch',
    oldPrice: null,
    price: '₹36,000',
  },
];

const FeaturedProducts = () => {
  return (
    <section className="fp-section">
      <div className="fp-inner">
        <div className="fp-header">
          <div className="fp-badge">Our Collection</div>
          <h2 className="fp-title">Featured <em>Murtis</em></h2>
          <p className="fp-sub">Best-selling and new arrival sacred marble idols</p>
        </div>
        <div className="fp-grid">
          {products.map((p, i) => (
            <div className="fp-card" key={i}>
              {p.badge && (
                <div
                  className="fp-product-badge"
                  style={p.badgeColor ? { background: p.badgeColor } : undefined}
                >
                  {p.badge}
                </div>
              )}
              <div className="fp-img">
                <span className="fp-img-icon">{p.icon}</span>
                <div className="fp-overlay">
                  <Link href="/products" className="fp-overlay-btn">QUICK VIEW</Link>
                  <Link href="/products" className="fp-overlay-btn">ADD TO CART</Link>
                </div>
              </div>
              <div className="fp-info">
                <div className="fp-name">{p.name}</div>
                <div className="fp-material">{p.material}</div>
                <div className="fp-footer">
                  <div className="fp-price">
                    {p.oldPrice && <span className="fp-old">{p.oldPrice}</span>}
                    {p.price}
                  </div>
                  <button className="fp-wishlist">♡</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
