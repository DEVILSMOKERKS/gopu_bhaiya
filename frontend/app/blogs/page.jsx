import { Suspense } from 'react';
import Blogs from '../../src/pages/Blogs';

export const dynamic = 'force-dynamic';

export default function BlogsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Blogs />
    </Suspense>
  );
}




