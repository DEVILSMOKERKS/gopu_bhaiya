import Login from '../../src/components/login/login/Login';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;

export const metadata = {
  title: 'Login - Mateshwari Moorti Bhandar',
  description: 'Login to your Mateshwari Moorti Bhandar account to access your orders, wishlist, and personalized shopping experience.',
  keywords: 'Login, Account, Mateshwari Moorti Bhandar, Sign In',
  alternates: {
    canonical: `${BASE_URL}/login`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <Login />;
}




