'use client';

import './WhyChooseUs.css';

const items = [
  {
    icon: '🪨',
    title: '100% Pure Marble',
    desc: 'Sourced directly from Makrana quarries — the same marble used in the Taj Mahal. No artificial stone, no shortcuts.',
  },
  {
    icon: '✋',
    title: 'Master Artisans',
    desc: 'Each murti is carved by artisans with 15–30 years of experience in the ancient Rajasthani marble-craft tradition.',
  },
  {
    icon: '🚚',
    title: 'Safe Pan-India Delivery',
    desc: 'Custom wooden crating and insured shipping ensures your murti arrives safely anywhere in India and abroad.',
  },
  {
    icon: '🛡️',
    title: 'Lifetime Warranty',
    desc: 'We stand behind every piece. Any defect in material or craftsmanship is repaired or replaced — for life.',
  },
];

const WhyChooseUs = () => {
  return (
    <div className="wcu-bg">
      <div className="wcu-inner">
        <div className="wcu-header">
          <div className="wcu-badge">Our Promise</div>
          <h2 className="wcu-heading">
            Why Devotees <em>Trust Us</em>
          </h2>
        </div>
        <div className="wcu-grid">
          {items.map((item, i) => (
            <div className="wcu-item" key={i}>
              <span className="wcu-icon">{item.icon}</span>
              <div className="wcu-title">{item.title}</div>
              <div className="wcu-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
