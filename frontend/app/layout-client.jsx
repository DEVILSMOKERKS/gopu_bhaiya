'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '../src/components/header/Header';
import Footer from '../src/components/footer/Footer';

const Signup = dynamic(() => import('../src/components/login/signup/Signup'), {
  ssr: false,
});

const ConnectSoonPopup = dynamic(
  () => import('../src/components/ConnectSoonPopup/ConnectSoonPopup'),
  { ssr: false }
);

const WelcomePopup = dynamic(
  () => import('../src/components/WelcomePopup/WelcomePopup'),
  { ssr: false }
);

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isComingSoon = false;
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showConnectSoon, setShowConnectSoon] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    if (!isAdmin) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname, isAdmin]);

  // Show Connect Soon popup on first visit (after delay)
  useEffect(() => {
    if (typeof window === 'undefined' || isAdmin) return;
    const dismissed = localStorage.getItem('connectSoon_dismissed');
    const submitted = localStorage.getItem('connectSoon_submitted');
    if (dismissed || submitted) return;
    const timer = setTimeout(() => setShowConnectSoon(true), 1500);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  return (
    <>
      {!isComingSoon && !isAdmin && <Header onAccountClick={() => setIsSignupOpen(true)} />}
      {children}
      {!isComingSoon && !isAdmin && <Footer />}

      {/* Connect Soon Popup - shows on first visit */}
      {showConnectSoon && !isAdmin && (
        <ConnectSoonPopup onClose={() => setShowConnectSoon(false)} />
      )}

      {/* Welcome popup - shows on every page load/refresh */}
      {!isAdmin && <WelcomePopup />}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <Signup onClose={() => setIsSignupOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}





