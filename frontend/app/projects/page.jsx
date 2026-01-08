import Projects from '../../src/pages/Projects';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const metadata = {
  title: 'Projects - Mateshwari Moorti Bhandar',
  description: 'Explore our completed projects showcasing our craftsmanship and design expertise. See our temple designs, pooja rooms, and custom creations.',
  keywords: 'Completed Projects, Temple Projects, Pooja Room Projects, Marble Idol Projects, Custom Creations, Mateshwari Moorti Bhandar',
  alternates: {
    canonical: `${BASE_URL}/projects`,
  },
  openGraph: {
    title: 'Projects - Mateshwari Moorti Bhandar',
    description: 'Explore our completed projects showcasing our craftsmanship and design expertise.',
    url: `${BASE_URL}/projects`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Mateshwari Moorti Bhandar Projects',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Mateshwari Moorti Bhandar',
    description: 'Explore our completed projects showcasing our craftsmanship and design expertise.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProjectsPage() {
  return <Projects />;
}






