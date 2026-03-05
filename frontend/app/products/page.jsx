import ProductsPage from '../../src/pages/ProductsPage';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Products - Mateshwari Moorti Bhandar',
  description: 'Browse our categories: Ganesh Temple, Radha Krishna, Hanuman, Shiv Temple and more. Premium marble idols and temple designs.',
  keywords: 'Products, Marble Idols, Temple, Radha Krishna, Ganesh, Hanuman, Mateshwari Moorti Bhandar',
  alternates: { canonical: `${BASE_URL}/products` },
  openGraph: {
    title: 'Products - Mateshwari Moorti Bhandar',
    description: 'Browse our categories and variants.',
    url: `${BASE_URL}/products`,
    siteName: 'Mateshwari Moorti Bhandar',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export default function ProductsRoutePage() {
  return <ProductsPage />;
}
