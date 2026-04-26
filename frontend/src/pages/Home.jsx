'use client';

import React from 'react';
import HeroSection from '../components/home/HeroSection/HeroSection';
import MarqueeStrip from '../components/home/MarqueeStrip/MarqueeStrip';
import ShopByDeity from '../components/home/ShopByDeity/ShopByDeity';
import FeaturedProducts from '../components/home/FeaturedProducts/FeaturedProducts';
import DreamTempleFiveSteps from '../components/home/DreamTempleFiveSteps/DreamTempleFiveSteps';
import WhyChooseUs from '../components/home/WhyChooseUs/WhyChooseUs';
import ProcessSteps from '../components/home/ProcessSteps/ProcessSteps';
import TestimonialsNew from '../components/home/TestimonialsNew/TestimonialsNew';
import CTABanner from '../components/home/CTABanner/CTABanner';
import FloatingButtons from '../components/home/FloatingButtons/FloatingButtons';
import WelcomeToTilak from '../components/home/WelcomeToTilak/WelcomeToTilak';
import DreamTempleSteps from '../components/home/DreamTempleSteps/DreamTempleSteps';
import ManufacturingProcess from '../components/home/ManufacturingProcess/ManufacturingProcess';
import ManufacturerCarousel from '../components/home/ManufacturerCarousel/ManufacturerCarousel';
import CustomTempleProjects from '../components/home/CustomTempleProjects/CustomTempleProjects';
import PoojaRoomBudget from '../components/home/PoojaRoomBudget/PoojaRoomBudget';
import HowToOrder from '../components/home/HowToOrder/HowToOrder';
import TrustedClients from '../components/home/TrustedClients/TrustedClients';
import ClientDiaries from '../components/home/ClientDiaries/ClientDiaries';
import FollowUs from '../components/home/FollowUs/FollowUs';
import OurBlogs from '../components/home/OurBlogs/OurBlogs';
// import FeaturedProducts from '../components/yourDreem/yourDreem'

const Home = () => {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Marble Idols & Temple Designs in Jaipur</h1>
        <p className="page-seo-description">
          Discover handcrafted marble idols, custom mandirs, and pooja room designs created with devotion and fine
          detailing. Explore ready collections or request a custom murti - our Jaipur team helps you choose the right
          size, finish, and delivery plan with clear guidance.
        </p>
      </section>
      <HeroSection />
      {/* <MarqueeStrip /> */}

      {/* Premium manufacturer carousel — center larger, R→L */}
      {/* <ManufacturerCarousel /> */}

      {/* New Template Sections */}
      <ShopByDeity />
      {/* <DreamTempleSteps/> */}
      {/* <FeaturedProducts /> */}
      <DreamTempleFiveSteps />
      {/* <WhyChooseUs /> */}
      {/* <ProcessSteps /> */}
      <TestimonialsNew />
      <CTABanner />

      {/* Existing Sections */}
      <WelcomeToTilak />
      <PoojaRoomBudget />
      <HowToOrder />
      <TrustedClients />
      <CustomTempleProjects />
      <ManufacturingProcess />
      <ClientDiaries />
      <FollowUs />

      {/* Floating WhatsApp, Call & Back-to-Top */}
      <FloatingButtons />
    </>
  );
};

export default Home;
