import Contactus from '../../src/components/contactUs/Contactus';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Contact Us - Welcome To Mateshwari Moorti Bhanda',
  description: 'Get in touch with Welcome To Mateshwari Moorti Bhanda. Contact us for custom marble idols, temple designs, consultations and free quotes. We reply within 24 hours.',
  keywords: 'Contact Us, Welcome To Mateshwari Moorti Bhanda, Custom Orders, Consultations, Inquiries',
  alternates: {
    canonical: `${BASE_URL}/contact-us`,
  },
  openGraph: {
    title: 'Contact Us - Welcome To Mateshwari Moorti Bhanda',
    description: 'Get in touch with Welcome To Mateshwari Moorti Bhanda for custom orders and consultations.',
    url: `${BASE_URL}/contact-us`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Contact Us - Welcome To Mateshwari Moorti Bhanda',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Welcome To Mateshwari Moorti Bhanda',
    description: 'Get in touch with Welcome To Mateshwari Moorti Bhanda for custom orders and consultations.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactUsPage() {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Contact Welcome To Mateshwari Moorti Bhanda</h1>
        <p className="page-seo-description">
          Planning a custom marble idol, temple design, or pooja room setup? Share your requirements and we will guide
          you with the right size, design options, and next steps. Our Jaipur team replies within 24 hours with clear
          suggestions, honest timelines, and smooth communication.
        </p>
      </section>
      <Contactus />
    </>
  );
}






