import OurCreations from '../../src/pages/OurCreations';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mateshwarimoortibhandar.com';

export const metadata = {
  title: 'Our Creations - Mateshwari Moorti Bhandar',
  description: 'Explore our beautiful creations including marble idols, temple designs, pooja rooms, stone carvings, and custom artworks. Authentic craftsmanship and timeless designs.',
  keywords: 'Marble Idols, Temple Designs, Pooja Room, Stone Carvings, Religious Artifacts, Custom Designs, Mateshwari Moorti Bhandar, Spiritual Art',
  alternates: {
    canonical: `${BASE_URL}/our-creations`,
  },
  openGraph: {
    title: 'Our Creations - Mateshwari Moorti Bhandar',
    description: 'Explore our beautiful creations including marble idols, temple designs, and custom artworks.',
    url: `${BASE_URL}/our-creations`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Mateshwari Moorti Bhandar Creations',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Creations - Mateshwari Moorti Bhandar',
    description: 'Explore our beautiful creations including marble idols, temple designs, and custom artworks.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OurCreationsPage() {
  return <OurCreations />;
}




