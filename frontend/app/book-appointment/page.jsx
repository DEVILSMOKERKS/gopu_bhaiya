import BookAppointment from '../../src/pages/BookAppointment';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Book Appointment - Mateshwari Moorti Bhandar',
  description: 'Book an appointment with Mateshwari Moorti Bhandar to discuss your spiritual and artistic needs. Consultation for temple designs, pooja rooms, and custom creations.',
  keywords: 'Book Appointment, Consultation, Custom Design Consultation, Temple Design Consultation, Mateshwari Moorti Bhandar',
  alternates: {
    canonical: `${BASE_URL}/book-appointment`,
  },
  openGraph: {
    title: 'Book Appointment - Mateshwari Moorti Bhandar',
    description: 'Book an appointment with Mateshwari Moorti Bhandar to discuss your spiritual and artistic needs.',
    url: `${BASE_URL}/book-appointment`,
    siteName: 'Mateshwari Moorti Bhandar',
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Book Appointment - Mateshwari Moorti Bhandar',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Appointment - Mateshwari Moorti Bhandar',
    description: 'Book an appointment with Mateshwari Moorti Bhandar to discuss your spiritual and artistic needs.',
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookAppointmentPage() {
  return <BookAppointment />;
}




