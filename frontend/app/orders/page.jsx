'use client';

import { useUser } from '../../src/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Orders from '../../src/pages/Orders';

export default function OrdersPage() {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <Orders />;
}






