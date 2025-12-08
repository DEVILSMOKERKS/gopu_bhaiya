import { Suspense } from 'react';
import Shop from '../../src/pages/shop/Shop';

export const dynamic = 'force-dynamic';

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
}




