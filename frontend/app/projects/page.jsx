import Projects from '../../src/pages/Projects';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const metadata = {
  title: 'Projects - Welcome To Mateshwari Moorti Bhanda',
  description: 'Explore our completed projects showcasing our craftsmanship and design expertise. See our temple designs, pooja rooms, and custom creations.',
  keywords: 'Completed Projects, Temple Projects, Pooja Room Projects, Marble Idol Projects, Custom Creations, Welcome To Mateshwari Moorti Bhanda',
  alternates: {
    canonical: `${BASE_URL}/projects`,
  },
  openGraph: {
    title: 'Projects - Welcome To Mateshwari Moorti Bhanda',
    description: 'Explore our completed projects showcasing our craftsmanship and design expertise.',
    url: `${BASE_URL}/projects`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Welcome To Mateshwari Moorti Bhanda Projects',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Welcome To Mateshwari Moorti Bhanda',
    description: 'Explore our completed projects showcasing our craftsmanship and design expertise.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Temple & Pooja Room Projects</h1>
        <p className="page-seo-description">
          See real work delivered for homes and temples - from custom mandir layouts and marble installations to finished
          pooja rooms and devotional interiors. These projects highlight detailing, scale, and design choices, helping
          you visualize what is possible before you start your own sacred space journey.
        </p>
      </section>
      <Projects />
    </>
  );
}






