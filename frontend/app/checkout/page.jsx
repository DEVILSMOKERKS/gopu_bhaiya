import Checkoutinfo from '../../src/components/Checkout/Checkoutinfo';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'Checkout - Welcome To Mateshwari Moorti Bhanda',
  description: 'Complete your purchase. Enter shipping details and payment information to finalize your order.',
  keywords: 'Checkout, Payment, Order, Welcome To Mateshwari Moorti Bhanda',
  alternates: {
    canonical: `${BASE_URL}/checkout`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CheckoutPage() {
  return <Checkoutinfo />;
}






