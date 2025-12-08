import { Suspense } from 'react';
import ThankYouPage from '../../src/pages/thankyouPage';

export const dynamic = 'force-dynamic';

export default function ThankYouPageRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouPage />
    </Suspense>
  );
}




