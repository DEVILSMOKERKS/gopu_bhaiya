'use client';

import './TestimonialsNew.css';

const testimonials = [
  {
    avatar: '🙏',
    name: 'RAMESH SHARMA',
    location: 'Jaipur, Rajasthan',
    text: 'The Ganesha murti we ordered for our new temple is beyond beautiful. The marble quality and craftsmanship are extraordinary. Jai Ganesh!',
  },
  {
    avatar: '🌸',
    name: 'PRIYA AGARWAL',
    location: 'Delhi, NCR',
    text: 'Ordered a custom Radha Krishna set for our mandir. The attention to detail — from the jewellery to the peacock feather — is simply divine.',
  },
  {
    avatar: '🛕',
    name: 'TEMPLE TRUST, SURAT',
    location: 'Surat, Gujarat',
    text: "We've ordered from many vendors but Mateshwari is on another level. The packaging, communication, and final product — all perfect. Highly recommended.",
  },
];

const TestimonialsNew = () => {
  return (
    <section className="tn-section">
      <div className="tn-inner">
        <div className="tn-header">
          <div className="tn-badge">Customer Stories</div>
          <h2 className="tn-title">What Devotees <em>Say</em></h2>
        </div>
        <div className="tn-grid">
          {testimonials.map((t, i) => (
            <div className="tn-card" key={i}>
              <div className="tn-stars">★★★★★</div>
              <div className="tn-text">{t.text}</div>
              <div className="tn-author">
                <div className="tn-avatar">{t.avatar}</div>
                <div>
                  <div className="tn-name">{t.name}</div>
                  <div className="tn-loc">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsNew;
