import Script from 'next/script';
import LayoutClient from './layout-client';
import Providers from './providers';
import '../src/index.css';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mateshwari Moorti Bhandar',
    template: '%s | Mateshwari Moorti Bhandar',
  },
  description:
    'Handcrafted marble idols, custom mandirs, pooja room designs, and devotional artistry from Jaipur by Mateshwari Moorti Bhandar.',
  applicationName: 'Mateshwari Moorti Bhandar',
  keywords: [
    'marble idols',
    'marble mandir',
    'pooja room design',
    'custom murti',
    'Jaipur marble idols',
    'Mateshwari Moorti Bhandar',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Mateshwari Moorti Bhandar',
    description:
      'Handcrafted marble idols, custom mandirs, pooja room designs, and devotional artistry from Jaipur.',
    url: BASE_URL,
    siteName: 'Mateshwari Moorti Bhandar',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/logobanner.png" />
        <link rel="apple-touch-icon" href="/logobanner.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        {/* Third-party scripts load after page is interactive — improves Performance */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq) return;
              n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
              if(!f._fbq) f._fbq=n;
              n.push=n; n.loaded=!0; n.version='2.0'; n.queue=[];
              t=b.createElement(e); t.async=!0; t.src=v;
              s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            try {
              fbq('init','1879559569290679');
              fbq('track','PageView');
            } catch(e) {}
          `}
        </Script>
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1879559569290679&ev=PageView&noscript=1"
            alt=""
            height="1"
            width="1"
          />
        </noscript>
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
