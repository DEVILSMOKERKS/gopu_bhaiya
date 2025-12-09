import AboutSection from '../../src/components/AboutUs/About';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'About Us - Mateshwari Moorti Bhandar',
  description: 'Learn about Mateshwari Moorti Bhandar - our history, craftsmanship, and commitment to creating authentic marble idols and temple designs.',
  keywords: 'About Us, Mateshwari Moorti Bhandar, History, Craftsmanship, Marble Idols, Temple Designs',
  alternates: {
    canonical: `${BASE_URL}/about-us`,
  },
  openGraph: {
    title: 'About Us - Mateshwari Moorti Bhandar',
    description: 'Learn about Mateshwari Moorti Bhandar - our history, craftsmanship, and commitment to authentic marble idols.',
    url: `${BASE_URL}/about-us`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'About Us - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Mateshwari Moorti Bhandar',
    description: 'Learn about Mateshwari Moorti Bhandar - our history and craftsmanship.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <AboutSection />;
}




