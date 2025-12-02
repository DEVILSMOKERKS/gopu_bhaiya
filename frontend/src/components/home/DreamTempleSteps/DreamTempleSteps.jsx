import React from 'react';
import './DreamTempleSteps.css';
import step1Image from '../../../assets/img/steps/step1.jpg'
import step2Image from '../../../assets/img/steps/step2.jpg'
import step3Image from '../../../assets/img/steps/step3.jpg'
import step4Image from '../../../assets/img/steps/step4.jpg'
import step5Image from '../../../assets/img/steps/step5.jpg'
import arrowIcon from '../../../assets/img/icons/arrow-right.png'

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
      <div className="dream-temple-container">
        <h2 className="dream-temple-title">Your Dream Temple in 5 steps</h2>
        <p className="dream-temple-subtitle">
          Looking to design your Dream Temple? Here's how you can get started.
        </p>

        <div className="dream-temple-steps-wrapper">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="dream-temple-step">
                <div className="dream-temple-step-circle">
                  <div className="dream-temple-step-illustration">
                    {step.image ? (
                      <img
                        src={step.image}
                        alt={step.title}
                        className="dream-temple-step-image"
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

              {/* Connecting Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="dream-temple-connector">
                  <img
                    src={arrowIcon}
                    alt="arrow"
                    className="dream-temple-arrow-icon"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DreamTempleSteps;
