import OurCreations from '../../src/pages/OurCreations';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Our Creations - Welcome To Mateshwari Moorti Bhanda',
  description: 'Explore our beautiful creations including marble idols, temple designs, pooja rooms, stone carvings, and custom artworks. Authentic craftsmanship and timeless designs.',
  keywords: 'Marble Idols, Temple Designs, Pooja Room, Stone Carvings, Religious Artifacts, Custom Designs, Welcome To Mateshwari Moorti Bhanda, Spiritual Art',
  alternates: {
    canonical: `${BASE_URL}/our-creations`,
  },
  openGraph: {
    title: 'Our Creations - Welcome To Mateshwari Moorti Bhanda',
    description: 'Explore our beautiful creations including marble idols, temple designs, and custom artworks.',
    url: `${BASE_URL}/our-creations`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Welcome To Mateshwari Moorti Bhanda Creations',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Creations - Welcome To Mateshwari Moorti Bhanda',
    description: 'Explore our beautiful creations including marble idols, temple designs, and custom artworks.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OurCreationsPage() {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Handcrafted Marble Idols & Temple Designs</h1>
        <p className="page-seo-description">
          Explore marble idols, mandir designs, pooja room concepts, and stone carvings made with patience and precision.
          Choose from ready collections or request a custom devotional piece - we will guide you on size, finish, and
          design so it fits your space and feels truly meaningful.
        </p>
      </section>
      <OurCreations />
    </>
  );
}






