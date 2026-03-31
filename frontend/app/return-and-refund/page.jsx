import Return from '../../src/components/return/Return';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Return and Refund Policy',
  description:
    'Understand exchange, cancellation, and refund terms for orders placed with Mateshwari Moorti Bhandar.',
  alternates: {
    canonical: `${BASE_URL}/return-and-refund`,
  },
};

export default function ReturnPage() {
  return <Return />;
}






