'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '../src/components/header/Header';
import Footer from '../src/components/footer/Footer';
import Signup from '../src/components/login/signup/Signup';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isComingSoon = false;
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    if (!isAdmin) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [pathname, isAdmin]);

  return (
    <>
      {!isComingSoon && !isAdmin && <Header onAccountClick={() => setIsSignupOpen(true)} />}
      {children}
      {!isComingSoon && !isAdmin && <Footer />}

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





