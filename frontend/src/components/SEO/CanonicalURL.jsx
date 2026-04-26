'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const CanonicalURL = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get current URL with search params if any
        const search = searchParams.toString();
        const currentUrl = window.location.origin + pathname + (search ? `?${search}` : '');

        // Find existing canonical link or create new one
        let canonicalLink = document.querySelector('link[rel="canonical"]');

        if (canonicalLink) {
            // Update existing canonical link
            canonicalLink.setAttribute('href', currentUrl);
        } else {
            // Create new canonical link
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            canonicalLink.setAttribute('href', currentUrl);
            document.head.appendChild(canonicalLink);
        }

        // Also update page title dynamically based on route
        const updatePageTitle = () => {
            const routeTitles = {
                '/': 'Welcome To Mateshwari Moorti Bhanda - Handcrafted Marble Idols & Temples',
                '/shop': 'Shop - Welcome To Mateshwari Moorti Bhanda',
                '/cart': 'Shopping Cart - Welcome To Mateshwari Moorti Bhanda',
                '/checkout': 'Checkout - Welcome To Mateshwari Moorti Bhanda',
                '/profile': 'My Profile - Welcome To Mateshwari Moorti Bhanda',
                '/orders': 'My Orders - Welcome To Mateshwari Moorti Bhanda',
                '/wishlist': 'My Wishlist - Welcome To Mateshwari Moorti Bhanda',
                '/contact': 'Contact Us - Welcome To Mateshwari Moorti Bhanda',
                '/about': 'About Us - Welcome To Mateshwari Moorti Bhanda',
                '/forgot-password': 'Forgot Password - Welcome To Mateshwari Moorti Bhanda',
                '/reset-password': 'Reset Password - Welcome To Mateshwari Moorti Bhanda'
            };

            const title = routeTitles[pathname] || 'Welcome To Mateshwari Moorti Bhanda - Handcrafted Marble Idols & Temples';
            document.title = title;
        };

        updatePageTitle();
    }, [pathname, searchParams]);

    return null; // This component doesn't render anything
};

export default CanonicalURL;
