'use client';

import './MarqueeStrip.css';

const MarqueeStrip = () => {
  const items = [
    'HANDCRAFTED MARBLE MURTIS',
    'MAKRANA WHITE MARBLE',
    'FREE PAN INDIA SHIPPING',
    'CUSTOM TEMPLE DESIGNS',
    'PRANA PRATISHTHA AVAILABLE',
    'SINCE 1972 · RAJASTHAN',
    '25% OFF SELECTED ITEMS',
  ];

  const repeated = [...items, ...items];

  return (
    <div className="marquee-strip">
      <div className="marquee-strip-inner">
        {repeated.map((text, i) => (
          <span key={i} className="marquee-strip-item">{text}</span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
