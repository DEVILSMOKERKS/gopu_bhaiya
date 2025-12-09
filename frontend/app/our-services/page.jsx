import OurServices from '../../src/pages/OurServices';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Our Services - Mateshwari Moorti Bhandar',
  description: 'Comprehensive services for temple design, pooja rooms, marble idols, stone carvings, cleaning, restoration, and repair work. Expert craftsmanship and care guidance.',
  keywords: 'Temple Design Services, Pooja Room Services, Marble Idol Services, Cleaning Services, Restoration, Repair Work, Mateshwari Moorti Bhandar Services',
  alternates: {
    canonical: `${BASE_URL}/our-services`,
  },
  openGraph: {
    title: 'Our Services - Mateshwari Moorti Bhandar',
    description: 'Comprehensive services for temple design, pooja rooms, marble idols, and more.',
    url: `${BASE_URL}/our-services`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Our Services - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services - Mateshwari Moorti Bhandar',
    description: 'Comprehensive services for temple design, pooja rooms, marble idols, and more.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OurServicesPage() {
  return <OurServices />;
}





