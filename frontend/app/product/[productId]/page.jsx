'use client';

import Product from '../../../src/pages/product/Product';

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }) {
  return <Product productId={params.productId} />;
}




