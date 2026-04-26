import Login from '../../src/components/login/login/Login';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;

export const metadata = {
  title: 'Login - Welcome To Mateshwari Moorti Bhanda',
  description: 'Login to your Welcome To Mateshwari Moorti Bhanda account to access your orders, wishlist, and personalized shopping experience.',
  keywords: 'Login, Account, Welcome To Mateshwari Moorti Bhanda, Sign In',
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






