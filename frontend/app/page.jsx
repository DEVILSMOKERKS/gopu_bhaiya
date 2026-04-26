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
  title: 'Marble Idols & Temple Designs in Jaipur | Mateshwari',
  description: 'Handcrafted marble idols, custom mandirs and pooja room designs from Jaipur. Trusted since 1972. Explore Radha Krishna, Ganesh, Shiv and more, or request a custom creation with a free consultation.',
  keywords: 'Marble Idols, Temple Designs, Pooja Room, Stone Carvings, Religious Artifacts, Custom Designs, Welcome To Mateshwari Moorti Bhanda, Spiritual Art',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Marble Idols & Temple Designs in Jaipur | Mateshwari',
    description: 'Handcrafted marble idols, custom mandirs and pooja room designs from Jaipur - trusted since 1972.',
    url: BASE_URL,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Welcome To Mateshwari Moorti Bhanda',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marble Idols & Temple Designs in Jaipur | Mateshwari',
    description: 'Handcrafted marble idols, custom mandirs and pooja room designs from Jaipur - trusted since 1972.',
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
      <section className="page-seo-intro">
        <h1 className="home-seo-title">
          Handcrafted Marble Idols, Custom Mandirs, and Pooja Room Designs
        </h1>
        {/* <p className="page-seo-description">
          Explore timeless devotional craftsmanship from Jaipur - custom murtis, marble temples, and pooja room designs
          made with fine detailing and premium stone. Browse ready collections or share your requirements for a custom
          piece; our team guides you on size, finish, and delivery with clear communication.
        </p> */}
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
