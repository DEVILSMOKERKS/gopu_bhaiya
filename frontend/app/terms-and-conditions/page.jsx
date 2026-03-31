import Terms from '../../src/components/terms/Terms';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Terms and Conditions',
  description:
    'Read the terms and conditions for using the Mateshwari Moorti Bhandar website, services, and ordering process.',
  alternates: {
    canonical: `${BASE_URL}/terms-and-conditions`,
  },
};

export default function TermsPage() {
  return <Terms />;
}






