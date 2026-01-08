import { Suspense } from 'react';
import Blogs from '../../src/pages/Blogs';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Blogs - Mateshwari Moorti Bhandar',
  description: 'Read our latest articles about marble idols, temple designs, spiritual practices, and traditional craftsmanship. Insights and stories from Mateshwari Moorti Bhandar.',
  keywords: 'Blogs, Articles, Marble Idols, Temple Designs, Spiritual Practices, Traditional Craftsmanship, Mateshwari Moorti Bhandar',
  alternates: {
    canonical: `${BASE_URL}/blogs`,
  },
  openGraph: {
    title: 'Blogs - Mateshwari Moorti Bhandar',
    description: 'Read our latest articles about marble idols, temple designs, and spiritual practices.',
    url: `${BASE_URL}/blogs`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Blogs - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs - Mateshwari Moorti Bhandar',
    description: 'Read our latest articles about marble idols, temple designs, and spiritual practices.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Blogs />
    </Suspense>
  );
}






