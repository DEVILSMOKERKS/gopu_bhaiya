import React from 'react';
import HeroSection from '../components/home/HeroSection/HeroSection';
import DreamTempleSteps from '../components/home/DreamTempleSteps/DreamTempleSteps';
import MateshwariCollection from '../components/home/MateshwariCollection/MateshwariCollection';
import MakersHands from '../components/home/MakersHands/MakersHands';
import DirectFromMakersHands from '../components/home/DirectFromMakersHands/DirectFromMakersHands';
import OurVision from '../components/home/OurVision/OurVision';
import ManufacturingProcess from '../components/home/ManufacturingProcess/ManufacturingProcess';
import HandcraftedIdols from '../components/home/HandcraftedIdols/HandcraftedIdols';
import CustomTempleProjects from '../components/home/CustomTempleProjects/CustomTempleProjects';
import PoojaRoomBudget from '../components/home/PoojaRoomBudget/PoojaRoomBudget';
import WelcomeToTilak from '../components/home/WelcomeToTilak/WelcomeToTilak';
import TrustedClients from '../components/home/TrustedClients/TrustedClients';
import ClientDiaries from '../components/home/ClientDiaries/ClientDiaries';
import FollowUs from '../components/home/FollowUs/FollowUs';
import OurBlogs from '../components/home/OurBlogs/OurBlogs';

const Home = () => {
  return (
    <>
      <HeroSection />
      <DreamTempleSteps />
      <MateshwariCollection />
      <MakersHands />
      <DirectFromMakersHands />
      <OurVision />
      <ManufacturingProcess />
      <HandcraftedIdols />
      <CustomTempleProjects />
      <PoojaRoomBudget />
      <WelcomeToTilak />
      <TrustedClients />
      <ClientDiaries />
      <FollowUs />
      <OurBlogs />
    </>
  );
};

export default Home;
