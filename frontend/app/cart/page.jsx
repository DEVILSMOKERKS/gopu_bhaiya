import Cart from '../../src/components/cart/Cart';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Shopping Cart - Mateshwari Moorti Bhandar',
  description: 'View your shopping cart items. Review and proceed to checkout for your selected marble idols and temple designs.',
  keywords: 'Shopping Cart, Cart, Checkout, Mateshwari Moorti Bhandar',
  alternates: {
    canonical: `${BASE_URL}/cart`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <Cart />;
}






