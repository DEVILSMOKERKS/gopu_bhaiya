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
      : `Buy ${productName} from Welcome To Mateshwari Moorti Bhanda. Premium quality products with authentic craftsmanship.`;

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
      'Welcome To Mateshwari Moorti Bhanda',
      'Premium Fashion',
      'Authentic Craftsmanship',
      product.subcategory?.name || '',
      product.brand || '',
    ].filter(Boolean).join(', ');

    const canonicalUrl = `${BASE_URL}/product/${productId}`;

    return {
      title: `${productName} | Welcome To Mateshwari Moorti Bhanda`,
      description: productDescription,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${productName} | Welcome To Mateshwari Moorti Bhanda`,
        description: productDescription,
        url: canonicalUrl,
        siteName: 'Welcome To Mateshwari Moorti Bhanda',
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
        type: 'website',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} | Welcome To Mateshwari Moorti Bhanda`,
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
    title: 'Product | Welcome To Mateshwari Moorti Bhanda',
    description: 'Discover premium quality products from Welcome To Mateshwari Moorti Bhanda. Authentic craftsmanship and timeless designs.',
    keywords: 'Welcome To Mateshwari Moorti Bhanda, Premium Fashion, Authentic Craftsmanship, Quality Products',
    alternates: {
      canonical: `${BASE_URL}/product/${productId}`,
    },
    openGraph: {
      title: 'Product | Welcome To Mateshwari Moorti Bhanda',
      description: 'Discover premium quality products from Welcome To Mateshwari Moorti Bhanda.',
      url: `${BASE_URL}/product/${productId}`,
      siteName: 'Welcome To Mateshwari Moorti Bhanda',
      images: [
        {
          url: `${BASE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: 'Welcome To Mateshwari Moorti Bhanda',
        },
      ],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product | Welcome To Mateshwari Moorti Bhanda',
      description: 'Discover premium quality products from Welcome To Mateshwari Moorti Bhanda.',
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


