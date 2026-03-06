import React from 'react';
import Image from 'next/image';
import './DreamTempleSteps.css';

import step1Image from '../../../assets/Images/collection/stapimg1.webp';
import step2Image from '../../../assets/Images/collection/stapimg2.webp';
import step3Image from '../../../assets/Images/collection/stapimg3.webp';
import step4Image from '../../../assets/Images/collection/stapimg4.webp';
import step5Image from '../../../assets/Images/collection/stapimg5.webp';
import rightArrow from '../../../assets/right_arrow.svg';

const DreamTempleSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Let's Connect One on One",
      image: step1Image,
    },
    {
      number: 2,
      title: "Explore our Catalog",
      image: step2Image,
    },
    {
      number: 3,
      title: "Place The Order",
      image: step3Image,
    },
    {
      number: 4,
      title: "Approval",
      image: step4Image,
    },
    {
      number: 5,
      title: "Delivery and Installation",
      image: step5Image,
    }
  ];

  return (
    <section className="dream-temple-steps">
      {/* <div className="dream-temple-container">
        <h2 className="dream-temple-title">Your Dream Temple in 5 steps</h2>
        <p className="dream-temple-subtitle">
          Looking to design your Dream Temple? Here&apos;s how you can get started.
        </p>

        <div className="dream-temple-steps-wrapper">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="dream-temple-step">
                <div className="dream-temple-step-circle">
                  <div className="dream-temple-step-illustration">
                    {step.image ? (
                      <Image
                        src={step.image}
                        alt={step.title}
                        className="dream-temple-step-image"
                        width={90}
                        height={90}
                        unoptimized 
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="dream-temple-step-placeholder">
                        Step {step.number}
                      </div>
                    )}
                  </div>
                </div>
                <p className="dream-temple-step-title">
                  <span className="dream-temple-step-number-prefix">{step.number} -</span> {step.title}
                </p>
              </div>

              Connecting Arrow (except for last step)
              {index < steps.length - 1 && (
                <div className="dream-temple-connector">
                  <Image
                    src={rightArrow}
                    alt="arrow"
                    className="dream-temple-arrow-icon"
                    width={36}
                    height={36}
                    unoptimized // Optional: You can remove if using optimized loader and your next.config is ready
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div> */}
    </section>
  );
};  

export default DreamTempleSteps;
