import { Suspense } from 'react';
import Shop from '../../src/pages/shop/Shop';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Shop - Mateshwari Moorti Bhandar',
  description: 'Browse our collection of premium marble idols, temple designs, pooja room accessories, and spiritual artifacts. Find the perfect piece for your home or temple.',
  keywords: 'Shop, Marble Idols, Temple Designs, Pooja Room, Spiritual Artifacts, Religious Items, Mateshwari Moorti Bhandar',
  alternates: {
    canonical: `${BASE_URL}/shop`,
  },
  openGraph: {
    title: 'Shop - Mateshwari Moorti Bhandar',
    description: 'Browse our collection of premium marble idols, temple designs, and spiritual artifacts.',
    url: `${BASE_URL}/shop`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Shop - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop - Mateshwari Moorti Bhandar',
    description: 'Browse our collection of premium marble idols, temple designs, and spiritual artifacts.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
}





