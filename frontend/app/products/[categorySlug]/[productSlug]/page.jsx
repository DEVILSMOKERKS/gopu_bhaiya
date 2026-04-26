import Product from '../../../../src/pages/product/Product.jsx';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }) {
  const { categorySlug, productSlug } = await params;

  try {
    const response = await fetch(`${API_URL}/products/${categorySlug}/${productSlug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return getDefaultMetadata(categorySlug, productSlug);
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      return getDefaultMetadata(categorySlug, productSlug);
    }

    const product = data.data;
    const productName = product.name || 'Product';
    const productDescription = product.description
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Buy ${productName} from Welcome To Mateshwari Moorti Bhanda.`;

    const productImage =
      product.colors?.[0]?.images?.[0] != null
        ? (typeof product.colors[0].images[0] === 'string'
            ? product.colors[0].images[0]
            : product.colors[0].images[0]?.url)
        : product.featured_image;
    const fullImageUrl =
      productImage && (productImage.startsWith('http') ? productImage : `${BASE_URL}${productImage.startsWith('/') ? '' : '/'}${productImage}`);

    const category = product.category_name || 'Products';
    const canonicalUrl = `${BASE_URL}/products/${categorySlug}/${productSlug}`;

    return {
      title: `${productName} | Welcome To Mateshwari Moorti Bhanda`,
      description: productDescription,
      keywords: [productName, category, 'Welcome To Mateshwari Moorti Bhanda'].filter(Boolean).join(', '),
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${productName} | Welcome To Mateshwari Moorti Bhanda`,
        description: productDescription,
        url: canonicalUrl,
        siteName: 'Welcome To Mateshwari Moorti Bhanda',
        images: fullImageUrl ? [{ url: fullImageUrl, width: 1200, height: 630, alt: productName }] : [],
        type: 'website',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} | Welcome To Mateshwari Moorti Bhanda`,
        description: productDescription,
      },
      robots: { index: true, follow: true },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return getDefaultMetadata(categorySlug, productSlug);
  }
}

function getDefaultMetadata(categorySlug, productSlug) {
  const canonicalUrl = `${BASE_URL}/products/${categorySlug}/${productSlug}`;
  return {
    title: 'Product | Welcome To Mateshwari Moorti Bhanda',
    description: 'Premium marble idols and temple designs from Welcome To Mateshwari Moorti Bhanda.',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Product | Welcome To Mateshwari Moorti Bhanda',
      url: canonicalUrl,
      siteName: 'Welcome To Mateshwari Moorti Bhanda',
      type: 'website',
      locale: 'en_IN',
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductDetailBySlugPage({ params }) {
  const { categorySlug, productSlug } = await params;
  return (
    <Product
      categorySlug={categorySlug}
      productSlug={productSlug}
    />
  );
}
