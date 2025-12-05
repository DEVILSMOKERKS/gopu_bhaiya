'use client';

import { useUser } from '../../src/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Profile from '../../src/components/profile/Profile';

export default function ProfilePage() {
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

  return <Profile />;
}


