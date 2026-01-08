import Product from '../../../src/pages/product/Product';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function generateMetadata({ params }) {
  const { productId } = await params;

  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return getDefaultMetadata(productId);
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      return getDefaultMetadata(productId);
    }

    const product = data.data;
    const productName = product.name || 'Product';
    const productDescription = product.description
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Buy ${productName} from Mateshwari Moorti Bhandar. Premium quality products with authentic craftsmanship.`;

    const productImage = product.images && product.images.length > 0
      ? (typeof product.images[0] === 'string'
        ? product.images[0]
        : product.images[0]?.url || product.images[0]?.src)
      : `${BASE_URL}/logo.png`;

    const fullImageUrl = productImage.startsWith('http')
      ? productImage
      : `${BASE_URL}${productImage}`;

    const price = product.min_price || product.price || product.max_price || '';
    const category = product.category?.name || product.category || 'Fashion';
    const keywords = [
      productName,
      category,
      'Mateshwari Moorti Bhandar',
      'Premium Fashion',
      'Authentic Craftsmanship',
      product.subcategory?.name || '',
      product.brand || '',
    ].filter(Boolean).join(', ');

    const canonicalUrl = `${BASE_URL}/product/${productId}`;

    return {
      title: `${productName} | Mateshwari Moorti Bhandar`,
      description: productDescription,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${productName} | Mateshwari Moorti Bhandar`,
        description: productDescription,
        url: canonicalUrl,
        siteName: 'Mateshwari Moorti Bhandar',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
        type: 'product',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} | Mateshwari Moorti Bhandar`,
        description: productDescription,
        images: [fullImageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': 'INR',
        'product:category': category,
        'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return getDefaultMetadata(productId);
  }
}

function getDefaultMetadata(productId) {
  return {
    title: 'Product | Mateshwari Moorti Bhandar',
    description: 'Discover premium quality products from Mateshwari Moorti Bhandar. Authentic craftsmanship and timeless designs.',
    keywords: 'Mateshwari Moorti Bhandar, Premium Fashion, Authentic Craftsmanship, Quality Products',
    alternates: {
      canonical: `${BASE_URL}/product/${productId}`,
    },
    openGraph: {
      title: 'Product | Mateshwari Moorti Bhandar',
      description: 'Discover premium quality products from Mateshwari Moorti Bhandar.',
      url: `${BASE_URL}/product/${productId}`,
      siteName: 'Mateshwari Moorti Bhandar',
      images: [
        {
          url: `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: 'Mateshwari Moorti Bhandar',
        },
      ],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product | Mateshwari Moorti Bhandar',
      description: 'Discover premium quality products from Mateshwari Moorti Bhandar.',
      images: [`${BASE_URL}/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }) {
  const { productId } = await params;
  return <Product productId={productId} />;
}


