import CategoryGallery from '../../../src/pages/CategoryGallery';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }) {
  const { categoryId: categoryName } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  let displayName = 'Products';

  try {
    if (API_URL) {
      const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const slug = String(categoryName).toLowerCase();
        const numericId = parseInt(categoryName, 10);
        const cat = data.data.find(
          (c) => c.slug?.toLowerCase() === slug || c.id === numericId
        );
        if (cat?.name) displayName = cat.name;
      }
    }
  } catch (_) {}

  return {
    title: `${displayName} | Welcome To Mateshwari Moorti Bhanda`,
    description: `Browse ${displayName} - premium marble idols and temple designs from Welcome To Mateshwari Moorti Bhanda.`,
    alternates: { canonical: `${BASE_URL}/category/${categoryName}` },
    openGraph: {
      title: `${displayName} | Welcome To Mateshwari Moorti Bhanda`,
      url: `${BASE_URL}/category/${categoryName}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { categoryId: categoryName } = await params;
  return <CategoryGallery categoryName={categoryName} />;
}
