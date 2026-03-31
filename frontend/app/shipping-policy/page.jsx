import ShippingPolicy from '../../src/components/shippingpolicy/ShippingPolicy';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Shipping Policy',
  description:
    'Review shipping timelines, packaging details, delivery coverage, and support information from Mateshwari Moorti Bhandar.',
  alternates: {
    canonical: `${BASE_URL}/shipping-policy`,
  },
};

export default function ShippingPolicyPage() {
  return <ShippingPolicy />;
}






