import AboutSection from '../../src/components/AboutUs/About';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'About Us - Welcome To Mateshwari Moorti Bhanda',
  description: 'Learn about Welcome To Mateshwari Moorti Bhanda - our history, craftsmanship, and commitment to creating authentic marble idols and temple designs.',
  keywords: 'About Us, Welcome To Mateshwari Moorti Bhanda, History, Craftsmanship, Marble Idols, Temple Designs',
  alternates: {
    canonical: `${BASE_URL}/about-us`,
  },
  openGraph: {
    title: 'About Us - Welcome To Mateshwari Moorti Bhanda',
    description: 'Learn about Welcome To Mateshwari Moorti Bhanda - our history, craftsmanship, and commitment to authentic marble idols.',
    url: `${BASE_URL}/about-us`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'About Us - Welcome To Mateshwari Moorti Bhanda',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Welcome To Mateshwari Moorti Bhanda',
    description: 'Learn about Welcome To Mateshwari Moorti Bhanda - our history and craftsmanship.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Marble Idols & Temple Designs Since 1972</h1>
        <p className="page-seo-description">
          Welcome To Mateshwari Moorti Bhanda is a Jaipur-based workshop preserving the art of hand-carved marble murtis and mandir
          design. For 50+ years, our artisans have crafted Makrana marble idols, pooja rooms, and custom temples with
          careful detailing, honest timelines, and guided support from design to delivery.
        </p>
      </section>
      <AboutSection />
    </>
  );
}






