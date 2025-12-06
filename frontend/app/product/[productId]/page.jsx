'use client';

import Product from '../../../src/pages/product/Product';

export default function ProductPage({ params }) {
  return <Product productId={params.productId} />;
}




