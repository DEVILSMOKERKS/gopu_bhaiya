import OurServices from '../../src/pages/OurServices';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Our Services - Welcome To Mateshwari Moorti Bhanda',
  description: 'Comprehensive services for temple design, pooja rooms, marble idols, stone carvings, cleaning, restoration, and repair work. Expert craftsmanship and care guidance.',
  keywords: 'Temple Design Services, Pooja Room Services, Marble Idol Services, Cleaning Services, Restoration, Repair Work, Welcome To Mateshwari Moorti Bhanda Services',
  alternates: {
    canonical: `${BASE_URL}/our-services`,
  },
  openGraph: {
    title: 'Our Services - Welcome To Mateshwari Moorti Bhanda',
    description: 'Comprehensive services for temple design, pooja rooms, marble idols, and more.',
    url: `${BASE_URL}/our-services`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Our Services - Welcome To Mateshwari Moorti Bhanda',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services - Welcome To Mateshwari Moorti Bhanda',
    description: 'Comprehensive services for temple design, pooja rooms, marble idols, and more.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OurServicesPage() {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Marble Idol & Temple Design Services</h1>
        <p className="page-seo-description">
          From custom murti carving and mandir layouts to pooja room planning and restoration, our services are handled
          as one guided journey. We help you choose materials, finalize detailing, and plan installation with clear
          communication - so your sacred space feels beautiful, practical, and truly lasting.
        </p>
      </section>
      <OurServices />
    </>
  );
}






