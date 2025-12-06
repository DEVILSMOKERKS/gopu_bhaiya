'use client';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from '../src/store/store';
import { UserProvider } from '../src/context/UserContext';
import { WishlistCartProvider } from '../src/context/wishlistCartContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import LayoutClient from './layout-client';
import '../src/index.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Meta Pixel Code */}
        <script
          key="meta-pixel"
          dangerouslySetInnerHTML={{
            __html: `
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
              } catch(error) {
                console.log('Meta Pixel blocked by ad blocker');
              }
            `,
          }}
        />
        {/* Google OAuth Script */}
        <script key="google-oauth" src="https://accounts.google.com/gsi/client" async defer></script>
        {/* Razorpay Checkout Script */}
        <script key="razorpay" src="https://checkout.razorpay.com/v1/checkout.js" async defer></script>
      </head>
      <body>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1879559569290679&ev=PageView&noscript=1"
            alt="pixal-facbook"
          />
        </noscript>
        <Provider store={store}>
          <HelmetProvider>
            <NotificationProvider>
              <UserProvider>
                <WishlistCartProvider>
                  <LayoutClient>
                    {children}
                  </LayoutClient>
                </WishlistCartProvider>
              </UserProvider>
            </NotificationProvider>
          </HelmetProvider>
        </Provider>
      </body>
    </html>
  );
}

