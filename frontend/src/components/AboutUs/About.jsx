'use client';

import React from 'react';
import Image from 'next/image';
import './about.css';
import about1 from '../../assets/img/who-banner.png';
import missionIcon from '../../assets/img/icons/mission.png';
import visionIcon from '../../assets/img/icons/vision.png';
import icon1 from "../../assets/img/icons/1.png";
import icon2 from "../../assets/img/icons/2.png";
import icon3 from "../../assets/img/icons/3.png";
import aboutup from '../../assets/img/aboutup.jpg';
import aboutbg from '../../assets/Images/banner/aboutbg.jpg';
import aboutBannerDesktop from '../../assets/Images/banner/customProjectsBgDesktop.jpg';
import aboutBannerMobile from '../../assets/Images/banner/customProjectsBgDesktop.jpg';
import whoWeAreBgDesktop1 from '../../assets/Images/banner/our-vision-bg-desktop1.png';
import whoWeAreBgDesktop2 from '../../assets/Images/banner/our-vision-bg-desktop2.png';
import whoWeAreBgMobile from '../../assets/Images/banner/our-vision-bg-mobile.png';
import Link from 'next/link';
import { Check } from 'lucide-react';
import TimelineStory from './TimelineStory';
import OurBlogs from '../home/OurBlogs/OurBlogs';
import TrustedClients from '../home/TrustedClients/TrustedClients';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import rectangle137 from '../../assets/img/Bestseller1.jpg';
import rectangle1372 from '../../assets/img/Bestseller2.jpg';
import rectangle1373 from '../../assets/img/Bestseller3.jpg';
import mandir from '../../assets/Images/banner/mandir.jpg';

const AboutSection = () => {
  const bannerStyle = {
    '--desktop-bg': aboutBannerDesktop ? `url(${aboutBannerDesktop})` : 'none',
    '--mobile-bg': aboutBannerMobile ? `url(${aboutBannerMobile})` : 'none'
  };

  return (
    <div className="about-container">
      {/* Top Banner Image */}
      <div className="about-banner" style={bannerStyle}>
        <div className="about-banner-overlay"></div>
        <div className="about-banner-content">
          <h1 className="about-banner-title">ABOUT US</h1>
        </div>
      </div>

      {/* Main Content Section - Who We Are */}
      <section className="about-who-we-are" style={{
        '--desktop-bg-left': whoWeAreBgDesktop1 ? `url(${whoWeAreBgDesktop1})` : 'none',
        '--desktop-bg-right': whoWeAreBgDesktop2 ? `url(${whoWeAreBgDesktop2})` : 'none',
        '--mobile-bg': whoWeAreBgMobile ? `url(${whoWeAreBgMobile})` : 'none'
      }}>
        <div className="about-who-we-are-container">
          <div className="about-who-we-are-content">
            {/* Left Section - Text Content */}
            <div className="about-who-we-are-text-section">
              <h2 className="about-who-we-are-title">Who We Are</h2>
              <h3 className="about-who-we-are-subtitle">
                Celebrating Tradition With A Modern Touch
              </h3>
              <p className="about-who-we-are-description">
                At Mateshwari Mandir, we believe every woman deserves to feel graceful, confident, and connected to her roots. Our collection of kurtis blends timeless Indian craftsmanship with contemporary designs, offering styles that are perfect for every occasion — from casual elegance to festive celebrations. Each piece is thoughtfully made using quality fabrics, intricate detailing, and vibrant colors that reflect the beauty of our rich culture. With us, it&apos;s not just fashion — it&apos;s a celebration of tradition, comfort, and individuality.
              </p>

              <Link href="#journey-section" className="about-who-we-are-cta-button" scroll={true}>
                View More
              </Link>
            </div>

            {/* Right Section - Images */}
            <div className="about-who-we-are-image-section">
              <div className="about-who-we-are-image-wrapper">
                {about1 ? (
                  <Image
                    className="about-who-we-are-main-image"
                    src={about1}
                    alt="Who We Are"
                    width={600}
                    height={800}
                  />
                ) : (
                  <div className="about-who-we-are-image-placeholder about-who-we-are-main-image">
                    <span>Who We Are</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mission & Vision Section */}
      <MissionVisionSection />
      {/* journey section */}
      <div id="journey-section">
        {/* Desktop Timeline */}
        <div className="journey-timeline-desktop-wrapper">
          <TimelineStory />
        </div>
        {/* Mobile Carousel */}
        <JourneyMobileCarousel />
      </div>
      {/* Craftsmanship Section */}
      <CraftsmanshipSection />
      {/* What Makes Us Different Section */}
      <WhatMakesUsDifferentSection />
    </div>
  );
};

const JourneyMobileCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    centerMode: false,
    beforeChange: (current, next) => setCurrentSlide(next),
    customPaging: (i) => (
      <div className={`journey-dot ${i === currentSlide ? 'active' : ''}`}></div>
    ),
    appendDots: (dots) => (
      <div className="journey-dots-container">
        <ul className="journey-dots">{dots}</ul>
      </div>
    ),
  };

  const journeyData = [
    {
      year: '2015',
      desc: `Mateshwari Exports was founded with a vision to bring divine craftsmanship to every home. We started our journey by creating handcrafted idols and temple solutions, combining traditional artistry with modern precision.`,
      img: rectangle137
    },
    {
      year: '2018',
      desc: `Expanded our product range to include custom temple designs and premium Pooja Room solutions. Our commitment to quality and authenticity helped us establish a strong presence in the spiritual home decor market.`,
      img: rectangle1372
    },
    {
      year: '2021',
      desc: `Launched our innovative virtual tour experience, becoming the first in the industry to offer immersive digital exploration of our sacred spaces. This milestone marked our entry into the digital era of spiritual commerce.`,
      img: rectangle1373
    },
    {
      year: '2022',
      desc: `Achieved significant growth in our manufacturing capabilities and customer base. We introduced bulk order services and expanded our reach to serve temples, institutions, and individual devotees nationwide.`,
      img: rectangle137
    },
    {
      year: '2023',
      desc: `Continuing our legacy of excellence, we remain dedicated to preserving traditional craftsmanship while embracing innovation. Today, Mateshwari Exports stands as a trusted name in divine home solutions.`,
      img: rectangle1372
    },
  ];

  return (
    <div className="journey-carousel-mobile">
      <div className="journey-carousel-header">
        <p className="journey-carousel-subtitle">About Mateshwari Exports</p>
        <h2 className="journey-carousel-title">Our Story of Growth & Success</h2>
        <p className="journey-carousel-description">
          Since 2015, we&apos;ve been dedicated to creating divine experiences through our handcrafted idols and temple solutions, bringing spiritual elegance to homes and hearts across the nation.
        </p>
      </div>
      <div className="journey-carousel-container-mobile">
        <Slider {...settings} className="journey-carousel-slider">
          {journeyData.map((item, idx) => (
            <div key={idx}>
              <div className="journey-carousel-card">
                <div className="journey-carousel-img-wrapper">
                  <Image src={item.img} alt={item.year} className="journey-carousel-img" width={400} height={300} />
                </div>
                <div className="journey-carousel-content">
                  <div className="journey-carousel-year">{item.year}</div>
                  <p className="journey-carousel-desc">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const MissionVisionSection = () => {
  return (
    <div className="mission-vision-section">
      <div className="mission-vision-container">
        {/* Mission & Vision Cards */}
        <div className="mission-vision-cards">
          {/* Mission */}
          <div className="mission-card">
            <div className="mission-icon">
              <Image src={missionIcon} alt="Mission Icon" className="mission-vision-img" width={80} height={80} />
            </div>
            <div>
              <h2 className="mission-title">OUR MISSION</h2>
              <p className="mission-text">
                Capture Hearts With Exquisite Designs At An Exceptional Value, And An Unmatched Customer Experience.
              </p>
            </div>
          </div>
          {/* Vision */}
          <div className="vision-card">
            <div className="vision-icon">
              <Image src={visionIcon} alt="Vision Icon" className="mission-vision-img" width={80} height={80} />
            </div>
            <div>
              <h2 className="vision-title">OUR VISION</h2>
              <p className="vision-text">
                Become The Most Loved Jewellery Brand In India & Beyond!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CraftsmanshipSection = () => {
  return (
    <div className="craftsmanship-wrapper">
      <div className="craftsmanship-container">
        {/* Header Section */}
        <div className="craftsmanship-header">
          <h2 className="craftsmanship-main-title">Craftsmanship & Quality</h2>
          <p className="craftsmanship-subtitle">
            Crafting Sacred Murtis With Timeless Precision
          </p>
        </div>
        {/* Features Grid */}
        <div className="craftsmanship-grid">
          {/* Divine Craftsmanship Card */}
          <div className="craftsmanship-card">
            <div className="craftsmanship-card-icon-wrapper">
              <div className="craftsmanship-card-icon-bg">
                <span className="craftsmanship-card-icon">
                  <Image src={icon1} alt="Divine Craftsmanship Icon" className="craftsmanship-card-img" width={60} height={60} />
                </span>
              </div>
            </div>
            <h3 className="craftsmanship-card-title">Divine Craftsmanship</h3>
            <p className="craftsmanship-card-description">
              Every Murti Is Hand-Carved With Precision, Purity, And Devotion.
            </p>
          </div>
          {/* Certified Materials Card */}
          <div className="craftsmanship-card">
            <div className="craftsmanship-card-icon-wrapper">
              <div className="craftsmanship-card-icon-bg">
                <span className="craftsmanship-card-icon">
                  <Image src={icon2} alt="Certified Materials Icon" className="craftsmanship-card-img" width={60} height={60} />
                </span>
              </div>
            </div>
            <h3 className="craftsmanship-card-title">Certified Materials</h3>
            <p className="craftsmanship-card-description">
              Delivering Sacred Artistry From India To The World With Unmatched Excellence.
            </p>
          </div>
          {/* Global Heritage Card */}
          <div className="craftsmanship-card">
            <div className="craftsmanship-card-icon-wrapper">
              <div className="craftsmanship-card-icon-bg">
                <span className="craftsmanship-card-icon">
                  <Image src={icon3} alt="Global Heritage Icon" className="craftsmanship-card-img" width={60} height={60} />
                </span>
              </div>
            </div>
            <h3 className="craftsmanship-card-title">Global Heritage</h3>
            <p className="craftsmanship-card-description">
              Delivering Sacred Artistry From India To The World With Unmatched Excellence.
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
                <Image
                  src={aboutup}
                  alt="Fashion model"
                  className="different-main-image"
                  width={600}
                  height={800}
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
                    <h3 className="different-feature-title">Certified Precious Stone & Marvel</h3>
                    <p className="different-feature-description">
                      Every Stone And Metal We Use Is Certified For Purity And Quality, Giving You Complete Confidence In Your Purchase.
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">Handcrafted By Local Artisans</h3>
                    <p className="different-feature-description">
                      Our Pieces Are Crafted By Skilled Local Artisans, Preserving Traditional Techniques While Supporting Local Communities.
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">Custom Design & Idols Collection</h3>
                    <p className="different-feature-description">
                      Create Your Dream Idols With Our Bespoke Design Service, Perfect For Creating Heirloom Pieces And Mandir Collections.
                    </p>
                  </div>
                </div>
                {/* Feature 4 */}
                <div className="different-feature-item">
                  <div className="different-check-icon">
                    <Check className="different-check-svg" />
                  </div>
                  <div className="different-feature-content">
                    <h3 className="different-feature-title">100% Transparency & BIS Hallmarked Murti</h3>
                    <p className="different-feature-description">
                      Every Stone And Metal We Use Is Certified For Purity And Quality, Giving You Complete Confidence In Your Purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Crafting Temples Section */}
      <div className="crafting-temples-section">
        <div className="crafting-temples-container">
          <div className="crafting-temples-grid">
            {/* Left Image Section - Desktop */}
            <div className="crafting-temples-image-area">
              <Image
                src={mandir}
                alt="Beautifully crafted Pooja Room temple"
                className="crafting-temples-image"
                width={600}
                height={800}
              />
            </div>
            {/* Right Text Section */}
            <div className="crafting-temples-text-area">
              <h2 className="crafting-temples-title">Crafting Temples, Building Trust</h2>
              <h3 className="crafting-temples-subtitle">Bringing Your Dream Temple To Life With Mateshwari Exports</h3>
              <p className="crafting-temples-intro">
                At Mateshwari Exports, we harmonize tradition, craftsmanship, and innovation to create timeless Pooja Room experiences. For the first time in the industry, we introduce a fully immersive virtual tour of our sacred spaces—designed to bring our artistry to your screen, wherever you are.
              </p>
              <div className="crafting-temples-features">
                <div className="crafting-temples-feature-item">
                  <h4 className="crafting-temples-feature-title">Timeless Craftsmanship</h4>
                  <p className="crafting-temples-feature-desc">Blending tradition with innovation to create sacred Pooja Rooms.</p>
                </div>
                <div className="crafting-temples-feature-item">
                  <h4 className="crafting-temples-feature-title">Virtual Tour Experience</h4>
                  <p className="crafting-temples-feature-desc">Explore our designs from anywhere with an immersive tour.</p>
                </div>
                <div className="crafting-temples-feature-item">
                  <h4 className="crafting-temples-feature-title">Custom Designs</h4>
                  <p className="crafting-temples-feature-desc">Tailored Pooja Room layouts that reflect your vision.</p>
                </div>
                <div className="crafting-temples-feature-item">
                  <h4 className="crafting-temples-feature-title">Superior Craftsmanship</h4>
                  <p className="crafting-temples-feature-desc">Intricate detailing and premium materials used in every creation.</p>
                </div>
                <div className="crafting-temples-feature-item">
                  <h4 className="crafting-temples-feature-title">Transform Your Home</h4>
                  <p className="crafting-temples-feature-desc">Bring a divine aura to your space with our Pooja Rooms.</p>
                </div>
              </div>
            </div>
            {/* Mobile Image Section */}
            <div className="crafting-temples-image-area-mobile">
              <Image
                src={mandir}
                alt="Beautifully crafted Pooja Room temple"
                className="crafting-temples-image"
                width={400}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Blogs Section */}
      <OurBlogs />

      {/* Trusted Clients Section */}
      <TrustedClients />

    </div>
  );
};

export default AboutSection;