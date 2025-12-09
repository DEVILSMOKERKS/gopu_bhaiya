'use client';

import React from 'react';
import HeroSection from '../components/home/HeroSection/HeroSection';
import DreamTempleSteps from '../components/home/DreamTempleSteps/DreamTempleSteps';
import ManufacturingProcess from '../components/home/ManufacturingProcess/ManufacturingProcess';
import CustomTempleProjects from '../components/home/CustomTempleProjects/CustomTempleProjects';
import PoojaRoomBudget from '../components/home/PoojaRoomBudget/PoojaRoomBudget';
import HowToOrder from '../components/home/HowToOrder/HowToOrder';
import TrustedClients from '../components/home/TrustedClients/TrustedClients';
import ClientDiaries from '../components/home/ClientDiaries/ClientDiaries';
import FollowUs from '../components/home/FollowUs/FollowUs';
import OurBlogs from '../components/home/OurBlogs/OurBlogs';

const Home = () => {
  return (
    <>
      <HeroSection />
      <DreamTempleSteps />

      <PoojaRoomBudget />
      <HowToOrder />
      <TrustedClients />
      <CustomTempleProjects />

      <ManufacturingProcess />

      <ClientDiaries />
      <FollowUs />
      <OurBlogs />
    </>
  );
};

export default Home;
