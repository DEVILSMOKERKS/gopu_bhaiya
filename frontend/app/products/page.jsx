import ProductsPage from '../../src/pages/ProductsPage';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Products - Welcome To Mateshwari Moorti Bhanda',
  description: 'Browse our categories: Ganesh Temple, Radha Krishna, Hanuman, Shiv Temple and more. Premium marble idols and temple designs.',
  keywords: 'Products, Marble Idols, Temple, Radha Krishna, Ganesh, Hanuman, Welcome To Mateshwari Moorti Bhanda',
  alternates: { canonical: `${BASE_URL}/products` },
  openGraph: {
    title: 'Products - Welcome To Mateshwari Moorti Bhanda',
    description: 'Browse our categories and variants.',
    url: `${BASE_URL}/products`,
    siteName: 'Welcome To Mateshwari Moorti Bhanda',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export default function ProductsRoutePage() {
  return (
    <>
      <section className="page-seo-intro">
        <h1 className="page-seo-title">Marble Idols by Category & Temple Designs</h1>
        <p className="page-seo-description">
          Browse our marble idol categories and temple design collections to find the right piece faster. From Ganesh,
          Radha Krishna, Shiv and Hanuman murtis to custom mandir concepts - every item is crafted with fine detailing,
          premium marble, and devotion for your home or temple.
        </p>
      </section>
      <ProductsPage />
    </>
  );
}
