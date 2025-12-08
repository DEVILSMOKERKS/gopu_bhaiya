'use client';

import BlogDetail from '../../../src/pages/BlogDetail';

export default function BlogDetailPage({ params }) {
  return <BlogDetail slug={params?.slug} />;
}




