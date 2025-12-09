import React, { useState, useEffect, useRef } from 'react';
import './CustomTempleProjects.css';
// Import background images - Update these paths when images are available
import customProjectsBgDesktop from '../../../assets/Images/banner/customProjectsBgDesktop.jpg';
import customProjectsBgMobile from '../../../assets/Images/banner/customProjectsBgMobile.jpg';
import mandirImage from '../../../assets/Images/banner/mandir.jpg';

const stats = [
  { number: '97+', label: 'Cities' },
  { number: '999+', label: 'Project' },
  { number: '50+', label: 'Years Of Experience' }
];

// Extract numeric value and suffix from stat number
const parseNumber = (numStr) => {
  const match = numStr.match(/(\d+)(.*)/);
  if (match) {
    return {
      value: parseInt(match[1], 10),
      suffix: match[2] || ''
    };
  }
  return { value: 0, suffix: '' };
};

// Animate counting function
const createAnimateCount = (setCountValues) => {
  return (targetValue, index, duration = 2000) => {
    const startValue = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);

      setCountValues(prev => {
        const newValues = [...prev];
        newValues[index] = currentValue;
        return newValues;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final value is set
        setCountValues(prev => {
          const newValues = [...prev];
          newValues[index] = targetValue;
          return newValues;
        });
      }
    };

    requestAnimationFrame(animate);
  };
};

const CustomTempleProjects = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [countValues, setCountValues] = useState(stats.map(() => 0));
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive background image
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 968);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Intersection Observer to detect when stats container is fully visible
  useEffect(() => {
    const animateCount = createAnimateCount(setCountValues);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if the stats container is at least 70% visible before starting animation
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7 && !hasAnimated) {
            setHasAnimated(true);
            // Small delay to ensure component is fully rendered and visible
            setTimeout(() => {
              // Start counting animation for each stat
              stats.forEach((stat, index) => {
                const { value } = parseNumber(stat.number);
                // Stagger the animations slightly for visual effect
                setTimeout(() => {
                  animateCount(value, index);
                }, index * 200);
              });
            }, 150);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Multiple thresholds for precise detection
        rootMargin: '0px'
      }
    );

    // Observe the stats container for more accurate detection
    const currentStatsRef = statsRef.current;
    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    return () => {
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, [hasAnimated]);

  // Get image source - Next.js imports return an object with src property
  const getImageSrc = (img) => {
    if (!img) return null;
    // Handle Next.js image imports
    if (typeof img === 'object') {
      return img.src || img.default?.src || img.default || null;
    }
    return img;
  };

  const mandirSrc = getImageSrc(mandirImage);
  const desktopBgSrc = getImageSrc(customProjectsBgDesktop);
  const mobileBgSrc = getImageSrc(customProjectsBgMobile);

  // Determine which background image to use
  const backgroundImageSrc = mandirSrc
    ? mandirSrc
    : (isMobile ? mobileBgSrc : desktopBgSrc);

  // Use inline styles for background image (Next.js compatible)
  const sectionStyle = {
    backgroundImage: backgroundImageSrc ? `url(${backgroundImageSrc})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section ref={sectionRef} className="custom-temple-projects" style={sectionStyle}>
      <div className="custom-temple-projects-container">
        <h2 className="custom-temple-projects-title">Our Custom Completed Projects</h2>
        <p className="custom-temple-projects-subtitle">Crafted With Creativity, Built With Excellence</p>
        <div ref={statsRef} className="custom-temple-projects-stats">
          {stats.map((stat, index) => {
            const { suffix } = parseNumber(stat.number);
            // Always show the current count value (will be 0 initially, then animate)
            const displayValue = `${countValues[index]}${suffix}`;
            return (
              <div key={index} className="custom-temple-projects-stat-card">
                <div className="custom-temple-projects-stat-number">{displayValue}</div>
                <div className="custom-temple-projects-stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomTempleProjects;

