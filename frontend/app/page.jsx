'use client';

import Home from '../src/pages/Home';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Mateshwari Moorti Bhandar - Premium Marble Idols & Temple Designs',
  description: 'Discover authentic marble idols, temple designs, pooja rooms, and custom spiritual artworks. Premium quality craftsmanship from Mateshwari Moorti Bhandar.',
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
  return <Home />;
}

