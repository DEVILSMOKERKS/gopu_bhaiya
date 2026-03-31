import dynamic from 'next/dynamic';

import HeroSection from '../src/components/home/HeroSection/HeroSection';
import ShopByDeity from '../src/components/home/ShopByDeity/ShopByDeity';

const DeferredSection = () => <section aria-hidden="true" style={{ minHeight: '240px' }} />;

const DreamTempleFiveSteps = dynamic(
  () => import('../src/components/home/DreamTempleFiveSteps/DreamTempleFiveSteps'),
  { ssr: false, loading: DeferredSection }
);
const TestimonialsNew = dynamic(
  () => import('../src/components/home/TestimonialsNew/TestimonialsNew'),
  { ssr: false, loading: DeferredSection }
);
const CTABanner = dynamic(
  () => import('../src/components/home/CTABanner/CTABanner'),
  { ssr: false, loading: DeferredSection }
);
const WelcomeToTilak = dynamic(
  () => import('../src/components/home/WelcomeToTilak/WelcomeToTilak'),
  { ssr: false, loading: DeferredSection }
);
const PoojaRoomBudget = dynamic(
  () => import('../src/components/home/PoojaRoomBudget/PoojaRoomBudget'),
  { ssr: false, loading: DeferredSection }
);
const HowToOrder = dynamic(
  () => import('../src/components/home/HowToOrder/HowToOrder'),
  { ssr: false, loading: DeferredSection }
);
const TrustedClients = dynamic(
  () => import('../src/components/home/TrustedClients/TrustedClients'),
  { ssr: false, loading: DeferredSection }
);
const CustomTempleProjects = dynamic(
  () => import('../src/components/home/CustomTempleProjects/CustomTempleProjects'),
  { ssr: false, loading: DeferredSection }
);
const ManufacturingProcess = dynamic(
  () => import('../src/components/home/ManufacturingProcess/ManufacturingProcess'),
  { ssr: false, loading: DeferredSection }
);
const ClientDiaries = dynamic(
  () => import('../src/components/home/ClientDiaries/ClientDiaries'),
  { ssr: false, loading: DeferredSection }
);
const FollowUs = dynamic(
  () => import('../src/components/home/FollowUs/FollowUs'),
  { ssr: false, loading: DeferredSection }
);
const FloatingButtons = dynamic(
  () => import('../src/components/home/FloatingButtons/FloatingButtons'),
  { ssr: false }
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Mateshwari Moorti Bhandar - Premium Marble Idols & Temple Designs',
  description: 'Discover handcrafted marble idols, temple designs and pooja rooms from Jaipur. Custom murtis, Radha Krishna, Ganesha and more. Trusted since 1972. Free consultation.',
  keywords: 'Marble Idols, Temple Designs, Pooja Room, Stone Carvings, Religious Artifacts, Custom Designs, Mateshwari Moorti Bhandar, Spiritual Art',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Mateshwari Moorti Bhandar - Premium Marble Idols & Temple Designs',
    description: 'Discover authentic marble idols, temple designs, and custom spiritual artworks.',
    url: BASE_URL,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mateshwari Moorti Bhandar - Premium Marble Idols & Temple Designs',
    description: 'Discover authentic marble idols, temple designs, and custom spiritual artworks.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <>
      <section className="home-seo-intro">
        <h1 className="home-seo-title">
          Handcrafted Marble Idols, Custom Mandirs, and Pooja Room Designs
        </h1>
        <p className="home-seo-description">
          Explore timeless devotional craftsmanship from Jaipur, including custom murtis, marble temples,
          and spiritual interiors created to bring warmth, beauty, and devotion into your space.
        </p>
      </section>
      <HeroSection />
      <ShopByDeity />
      <DreamTempleFiveSteps />
      <TestimonialsNew />
      <CTABanner />
      <WelcomeToTilak />
      <PoojaRoomBudget />
      <HowToOrder />
      <TrustedClients />
      <CustomTempleProjects />
      <ManufacturingProcess />
      <ClientDiaries />
      <FollowUs />
      <FloatingButtons />
    </>
  );
}
