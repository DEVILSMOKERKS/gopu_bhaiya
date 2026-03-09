'use client';

import './ProcessSteps.css';

const steps = [
  {
    num: '01',
    title: 'Consultation',
    desc: 'Share your requirements — deity, size, material, finish. Our experts guide you.',
  },
  {
    num: '02',
    title: 'Design Approval',
    desc: 'We share design sketches and 3D references for your approval before carving begins.',
  },
  {
    num: '03',
    title: 'Handcrafting',
    desc: 'Master artisans carve, paint, and adorn your murti with devotion over 15–45 days.',
  },
  {
    num: '04',
    title: 'Quality Check',
    desc: 'Every inch is inspected before packing. You receive progress photos throughout.',
  },
  {
    num: '05',
    title: 'Safe Delivery',
    desc: 'Custom crated, insured, and delivered to your doorstep across India.',
  },
];

const ProcessSteps = () => {
  return (
    <section className="ps-section">
      <div className="ps-inner">
        <div className="ps-header">
          <div className="ps-badge">Simple Process</div>
          <h2 className="ps-title">How It <em>Works</em></h2>
          <p className="ps-sub">From your vision to a consecrated murti in your home</p>
        </div>
        <div className="ps-grid">
          {steps.map((step, i) => (
            <div className="ps-step" key={i}>
              <div className="ps-num">{step.num}</div>
              <div className="ps-step-title">{step.title}</div>
              <div className="ps-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
