import { Suspense } from 'react';
import Blogs from '../../src/pages/Blogs';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Blogs - Welcome To Mateshwari Moorti Bhanda',
  description: 'Read our latest articles about marble idols, temple designs, spiritual practices, and traditional craftsmanship. Insights and stories from Welcome To Mateshwari Moorti Bhanda.',
  keywords: 'Blogs, Articles, Marble Idols, Temple Designs, Spiritual Practices, Traditional Craftsmanship, Welcome To Mateshwari Moorti Bhanda',
  alternates: {
    canonical: `${BASE_URL}/blogs`,
  },
  openGraph: {
    title: 'Blogs - Welcome To Mateshwari Moorti Bhanda',
    description: 'Read our latest articles about marble idols, temple designs, and spiritual practices.',
    url: `${BASE_URL}/blogs`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Blogs - Welcome To Mateshwari Moorti Bhanda',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs - Welcome To Mateshwari Moorti Bhanda',
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
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Marble Idol Care & Temple Design Articles</h1>
        <p className="page-seo-description">
          Simple, practical reads on marble care, mandir planning, pooja room ideas, and devotional decor. These articles
          share real tips from our workshop experience - so your sacred pieces stay beautiful for years and your space
          feels calm, clean, and thoughtfully designed.
        </p>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <Blogs />
      </Suspense>
    </>
  );
}






