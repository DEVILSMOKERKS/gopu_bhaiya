import Contactus from '../../src/components/contactUs/Contactus';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Contact Us - Mateshwari Moorti Bhandar',
  description: 'Get in touch with Mateshwari Moorti Bhandar. Contact us for custom marble idols, temple designs, consultations and free quotes. We reply within 24 hours.',
  keywords: 'Contact Us, Mateshwari Moorti Bhandar, Custom Orders, Consultations, Inquiries',
  alternates: {
    canonical: `${BASE_URL}/contact-us`,
  },
  openGraph: {
    title: 'Contact Us - Mateshwari Moorti Bhandar',
    description: 'Get in touch with Mateshwari Moorti Bhandar for custom orders and consultations.',
    url: `${BASE_URL}/contact-us`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Contact Us - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Mateshwari Moorti Bhandar',
    description: 'Get in touch with Mateshwari Moorti Bhandar for custom orders and consultations.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactUsPage() {
  return <Contactus />;
}






