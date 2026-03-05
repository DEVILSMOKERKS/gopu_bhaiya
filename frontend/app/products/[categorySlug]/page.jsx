import ProductsByCategory from '../../../src/pages/ProductsByCategory';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  let displayName = 'Products';

  try {
    if (API_URL) {
      const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const slug = String(categorySlug).toLowerCase();
        const cat = data.data.find((c) => c.slug?.toLowerCase() === slug);
        if (cat?.name) displayName = cat.name;
      }
    }
  } catch (_) {}

  return {
    title: `${displayName} - Mateshwari Moorti Bhandar`,
    description: `Browse ${displayName} variants - premium marble idols from Mateshwari Moorti Bhandar.`,
    alternates: { canonical: `${BASE_URL}/products/${categorySlug}` },
    openGraph: {
      title: `${displayName} - Mateshwari Moorti Bhandar`,
      url: `${BASE_URL}/products/${categorySlug}`,
    },
  };
}

export default async function ProductsByCategoryRoute({ params }) {
  const { categorySlug } = await params;
  return <ProductsByCategory categorySlug={categorySlug} backHref="/products" productLinkBase={`/products/${categorySlug}`} />;
}
