'use client';

import { useUser } from '../../../src/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import OrderDetails from '../../../src/pages/OrderDetails';

export default function OrderDetailsPage() {
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

  return <OrderDetails orderId={params.orderId} />;
}





