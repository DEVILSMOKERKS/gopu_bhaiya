import Privacy from '../../src/components/Privacy/Privacy';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Read the privacy policy of Mateshwari Moorti Bhandar to understand how we collect, use, and protect your information.',
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}






