'use client';

import { usePathname } from 'next/navigation';
import Header from '../src/components/header/Header';
import Footer from '../src/components/footer/Footer';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isComingSoon = false;

  return (
    <>
      {!isComingSoon && !isAdmin && <Header />}
      {children}
      {!isComingSoon && !isAdmin && <Footer />}
    </>
  );
}



