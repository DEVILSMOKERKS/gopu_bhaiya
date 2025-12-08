import HowToPlaceOrder from '../../src/pages/HowToPlaceOrder';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mateshwarimoortibhandar.com';

export const metadata = {
  title: 'How to Place Order - Mateshwari Moorti Bhandar',
  description: 'Learn how to place an order for our products or book a custom creation consultation. Step-by-step guide to ordering from Mateshwari Moorti Bhandar.',
  keywords: 'How to Order, Place Order, Order Guide, Custom Order, Mateshwari Moorti Bhandar Order Process',
  alternates: {
    canonical: `${BASE_URL}/how-to-place-order`,
  },
  openGraph: {
    title: 'How to Place Order - Mateshwari Moorti Bhandar',
    description: 'Learn how to place an order for our products or book a custom creation consultation.',
    url: `${BASE_URL}/how-to-place-order`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'How to Place Order - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Place Order - Mateshwari Moorti Bhandar',
    description: 'Learn how to place an order for our products or book a custom creation consultation.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HowToPlaceOrderPage() {
  return <HowToPlaceOrder />;
}
