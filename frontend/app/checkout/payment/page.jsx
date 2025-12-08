import { Suspense } from 'react';
import Checkoutpayment from '../../../src/components/Checkoutpayment/Checkoutpayment';

export const dynamic = 'force-dynamic';

export default function CheckoutPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Checkoutpayment />
    </Suspense>
  );
}




