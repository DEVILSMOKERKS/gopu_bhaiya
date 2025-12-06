'use client';

import ViewProduct from '../../../../../src/admin/pages/product/ViewProduct';

export default function ViewProductPage({ params }) {
  return <ViewProduct productId={params.productId} />;
}




