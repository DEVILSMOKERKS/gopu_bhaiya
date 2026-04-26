import { Suspense } from 'react';
import Shop from '../../src/pages/shop/Shop';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Shop - Welcome To Mateshwari Moorti Bhanda',
  description: 'Browse our collection of premium marble idols, temple designs, pooja room accessories, and spiritual artifacts. Find the perfect piece for your home or temple.',
  keywords: 'Shop, Marble Idols, Temple Designs, Pooja Room, Spiritual Artifacts, Religious Items, Welcome To Mateshwari Moorti Bhanda',
  alternates: {
    canonical: `${BASE_URL}/shop`,
  },
  openGraph: {
    title: 'Shop - Welcome To Mateshwari Moorti Bhanda',
    description: 'Browse our collection of premium marble idols, temple designs, and spiritual artifacts.',
    url: `${BASE_URL}/shop`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Shop - Welcome To Mateshwari Moorti Bhanda',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop - Welcome To Mateshwari Moorti Bhanda',
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
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Shop Marble Idols, Temple Designs & Sacred Decor</h1>
        <p className="page-seo-description">
          Use filters to find the right piece without the stress. Explore handcrafted marble murtis, mandirs, pooja room
          accessories, and sacred decor with clear product details and smooth browsing. Compare options, shortlist
          favorites, and choose a design that brings calm and devotion into your space.
        </p>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <Shop />
      </Suspense>
    </>
  );
}






