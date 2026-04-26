import Testimonials from '../../src/pages/Testimonials';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const metadata = {
  title: 'Testimonials - Welcome To Mateshwari Moorti Bhanda',
  description: 'Read what our customers say about Welcome To Mateshwari Moorti Bhanda and our products. Real reviews from satisfied customers.',
  keywords: 'Customer Reviews, Testimonials, Customer Feedback, Welcome To Mateshwari Moorti Bhanda Reviews, Product Reviews',
  alternates: {
    canonical: `${BASE_URL}/testimonials`,
  },
  openGraph: {
    title: 'Testimonials - Welcome To Mateshwari Moorti Bhanda',
    description: 'Read what our customers say about Welcome To Mateshwari Moorti Bhanda and our products.',
    url: `${BASE_URL}/testimonials`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Welcome To Mateshwari Moorti Bhanda Testimonials',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testimonials - Welcome To Mateshwari Moorti Bhanda',
    description: 'Read what our customers say about Welcome To Mateshwari Moorti Bhanda and our products.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TestimonialsPage() {
  return <Testimonials />;
}






