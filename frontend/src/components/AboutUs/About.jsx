import React from 'react';
import './about.css';
import about1 from '../../assets/img/who-banner.png';
import missionIcon from '../../assets/img/icons/mission.png';
import visionIcon from '../../assets/img/icons/vision.png';
import diamond3 from '../../assets/img/icons/diamond3.png';
import necklace from '../../assets/img/icons/necklace.png';
import { Gem, Award, Palette, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import diamond from "../../assets/img/icons/diamond.png";
import icon1 from "../../assets/img/icons/1.png";
import icon2 from "../../assets/img/icons/2.png";
import icon3 from "../../assets/img/icons/3.png";
import aboutup from '../../assets/Images/collection/collection2.jpg';
import aboutbg from '../../assets/Images/banner/hero-1.png';
import HomeBlog from '../Homeblog/Homeblog';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import rectangle137 from '../../assets/img/Bestseller1.jpg';
import rectangle1372 from '../../assets/img/Bestseller2.jpg';
import rectangle1373 from '../../assets/img/Bestseller3.jpg';
import { HashLink } from 'react-router-hash-link';

const AboutSection = () => {
  return (
    <div className="about-container">
      {/* Top Banner Image */}
      <div className="about-banner">
        <div className="about-banner-overlay"></div>
        <div className="about-banner-content">
          <h1 className="about-banner-title">ABOUT US</h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="about-main-section">
        <div className="about-content-wrapper">
          <div className="about-grid">
            {/* Left Text Section */}
            <div className="about-text-area">
              <div className="about-header">
                <h2 className="about-section-title">WHO WE ARE</h2>
                <div className="about-title-line"></div>
              </div>
              <h3 className="about-main-title">Crafting More Than Clothes — We Craft Confidence</h3>
              <div className="about-text-content">
                <p>
                  At Mateshwari Moorti Bhandar, we believe that clothing should be more than just fabric – it should be a reflection of confidence, style, and individuality. Born from a passion for timeless fashion and rooted in quality craftsmanship, our brand blends contemporary trends with classic elegance.
                </p>
              </div>
              <HashLink smooth to="#journey-section" className="about-view-btn">
                View More
              </HashLink>
            </div>
            {/* Right Image Section */}
            <div className="about-image-area">
              <div className="about-image-container">
                <img
                  src={about1}
                  alt="Fashion showcase"
                  className="about-main-img"
                />
                {/* Mateshwari Moorti Bhandar Logo Overlay */}
              
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mission & Vision Section */}
      <MissionVisionSection />
      {/* journey section */}
      <div id="journey-section">
        <JourneySection />
      </div>
      {/* Craftsmanship Section */}
      <CraftsmanshipSection />
      {/* What Makes Us Different Section */}
      <WhatMakesUsDifferentSection />
    </div>
  );
};

const MissionVisionSection = () => {
  return (
    <div className="mission-vision-section">
      {/* Top Left Necklace Image */}
      <img src={necklace} alt="Fashion Accessory" className="mission-vision-necklace" />
      <div className="mission-vision-container">
        {/* Mission & Vision Cards Centered */}
        <div className="mission-vision-cards">
          {/* Mission */}
          <div className="mission-card">
            <div className="mission-icon">
              <img src={missionIcon} alt="Mission Icon" className="mission-vision-img" />
            </div>
            <div>
              <h2 className="mission-title">OUR MISSION</h2>
              <p className="mission-text">
                Empower individuals with stylish, comfortable, and sustainable fashion that reflects their unique personality and lifestyle.
              </p>
            </div>
          </div>
          {/* Vision */}
          <div className="vision-card">
            <div className="vision-icon">
              <img src={visionIcon} alt="Vision Icon" className="mission-vision-img" />
            </div>
            <div>
              <h2 className="vision-title">OUR VISION</h2>
              <p className="vision-text">
                Become the most trusted fashion brand in India & beyond, known for quality, style, and sustainability!
              </p>
            </div>
          </div>
        </div>
        {/* Right Center Diamond Image */}
        <img src={diamond3} alt="Fashion Icon" className="mission-vision-diamond" />
      </div>
    </div>
  );
};

const JourneySection = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
        }
      }
    ],
  };
  const sliderRef = React.useRef(null);
  
  const journeyData = [
    { year: '2018', desc: `Started with a vision to create comfortable, stylish clothing that empowers individuals to express their unique style.`, img: rectangle137 },
    { year: '2020', desc: `Expanded our collection to include sustainable fashion, focusing on eco-friendly materials and ethical manufacturing.`, img: rectangle1372 },
    { year: '2022', desc: `Became a trusted name in fashion, known for quality craftsmanship and innovative designs that stand the test of time.`, img: rectangle1373 },
  ];
  
  return (
    <div className="journey-container">
      <div className="journey-title-area">
   
        <div className="journey-title-block">
          <div className="journey-title-line journey-title-line-left" />
          <h2 className="journey-title-text">The Journey</h2>
          <div className="journey-title-line journey-title-line-right" />
        </div>
      </div>
      <div className="journey-carousel-container">
        <Slider {...settings} className="journey-carousel" ref={sliderRef}>
          {journeyData.map((item, idx) => (
            <div key={idx}>
              <div className="journey-card">
                <div className='journey-card-img-wrapper'>
                  <img src={item.img} alt={item.year} className="journey-card-img" />
                </div>
                <div className="journey-card-content">
                  <div className="journey-card-year">{item.year}</div>
                  <div className="journey-card-desc">{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        {/* Custom arrows below the carousel */}
        <div className="journey-carousel-arrow-group">
          <button
            className="journey-arrow"
            onClick={() => sliderRef.current && sliderRef.current.slickPrev()}
            aria-label="Previous"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            className="journey-arrow"
            onClick={() => sliderRef.current && sliderRef.current.slickNext()}
            aria-label="Next"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

const CraftsmanshipSection = () => {
  return (
    <div className="craftsmanship-wrapper">
      <div className="craftsmanship-container">
        {/* Header Section */}
        <div className="craftsmanship-header">
          <div className="craftsmanship-icon-wrapper"></div>
          <div className="craftsmanship-title-row">
            <span className="craftsmanship-title-line-left"></span>
            <h2 className="craftsmanship-main-title">
              Mateshwari Moorti Bhandar Craftsmanship
            </h2>
            <span className="craftsmanship-title-line-right"></span>
          </div>
          <p className="craftsmanship-subtitle">
            Each idol is a masterpiece, sculpted with devotion, precision, and deep reverence to tradition.
          </p>
        </div>
        {/* Features Grid */}
        <div className="craftsmanship-grid">
          {/* Pure Marble Selection Card */}
          <div className="craftsmanship-card">
            <div className="craftsmanship-card-icon-wrapper">
              <div className="craftsmanship-card-icon-bg">
                <span className="craftsmanship-card-icon">
                  <img src={icon1} alt="Pure Marble Icon" className="craftsmanship-card-img" />
                </span>
              </div>
            </div>
            <h3 className="craftsmanship-card-title">Finest Quality Marble</h3>
            <p className="craftsmanship-card-description">
              We use only the best and purest marble, handpicked for durability and divine aura, ensuring every moorti is flawless.
            </p>
          </div>
          {/* Tradition & Skill Card */}
          <div className="craftsmanship-card">
            <div className="craftsmanship-card-icon-wrapper">
              <div className="craftsmanship-card-icon-bg">
                <span className="craftsmanship-card-icon">
                  <img src={icon2} alt="Artisan Skill Icon" className="craftsmanship-card-img" />
                </span>
              </div>
            </div>
            <h3 className="craftsmanship-card-title">Generations of Artistry</h3>
            <p className="craftsmanship-card-description">
              Our artisans inherit centuries-old sculpting techniques, bringing legends and deities to life with intricate handiwork and soulful expression.
            </p>
          </div>
          {/* Devotional Detailing Card */}
          <div className="craftsmanship-card">
            <div className="craftsmanship-card-icon-wrapper">
              <div className="craftsmanship-card-icon-bg">
                <span className="craftsmanship-card-icon">
                  <img src={icon3} alt="Devotional Detail Icon" className="craftsmanship-card-img" />
                </span>
              </div>
            </div>
            <h3 className="craftsmanship-card-title">Devotional Detailing</h3>
            <p className="craftsmanship-card-description">
              Every idol features carefully carved features and sacred motifs, finished with hand painting and ornamentation that honors our spiritual heritage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WhatMakesUsDifferentSection = () => {
  return (
    <div className="different-wrapper">
      {/* What Makes Us Different Section */}
      <div className="different-main-section" style={{ backgroundImage: `url(${aboutbg})` }}>
        <div className="different-overlay"></div>
        <div className="different-content-container">
          {/* Header - Centered above both image and text */}
          <div className="different-header">
            <div className="about-different-title-line">
              <span className="about-different-title-line-left"></span>
              <h2 className="about-different-title">WHAT MAKES US DIFFERENT</h2>
              <span className="about-different-title-line-right"></span>
            </div>
          </div>
          <div className="different-grid">
            {/* Left Image Section */}
            <div className="different-image-area">
              <div className="different-image-frame">
                <img
                  src={aboutup}
                  alt="Fashion model"
                  className="different-main-image"
                />
              </div>
            </div>
            {/* Right Content Section */}
            <div className="different-text-area">
              {/* Features List */}
              <div className="different-features-list">
                {/* Feature 1 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">Premium Quality Fabrics</h3>
                    <p className="different-feature-description">
                      We source only the finest materials, ensuring every garment feels luxurious and lasts through countless wears.
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">Perfect Fit Guarantee</h3>
                    <p className="different-feature-description">
                      Our expert tailoring ensures every piece fits perfectly, making you look and feel your absolute best.
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">Sustainable & Ethical</h3>
                    <p className="different-feature-description">
                      We're committed to eco-friendly practices and fair labor, making fashion that's good for you and the planet.
                    </p>
                  </div>
                </div>
                {/* Feature 4 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">Timeless Design</h3>
                    <p className="different-feature-description">
                      Our pieces are designed to transcend trends, creating a wardrobe that's both stylish and enduring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Who We Are Section */}
      <div className="who-we-are-section">
        <div className="who-content-container">
          <div className="who-grid">
            {/* Left Image Section */}
            <div className="who-image-area">
              <img
                src={aboutbg}
                alt="Fashion models showcasing our collection"
                className="who-main-image"
              />
            </div>
            {/* Right Text Section */}
            <div className="who-text-area">
              <div className="who-header">
                <h2 className="who-section-title">WHO WE ARE</h2>
                <div className="who-title-line"></div>
              </div>
              <h3 className="who-main-title">Crafting More Than Clothes — We Craft Confidence</h3>
              <div className="who-text-content">
                <p>
                  At Mateshwari Moorti Bhandar, we believe that clothing should be more than just fabric – it should be a reflection of confidence, style, and individuality. Born from a passion for timeless fashion and rooted in quality craftsmanship, our brand blends contemporary trends with classic elegance.
                </p>
                <p className="who-additional-text">
                  handcrafted by skilled artisans, we're proud to offer pieces that are as meaningful as they are magnificent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* blog section */}
      <HomeBlog />

    </div>
  );
};

export default AboutSection;