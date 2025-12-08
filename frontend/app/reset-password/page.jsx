import { Suspense } from 'react';
import ResetPassword from '../../src/components/login/reset-password/ResetPassword';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}




