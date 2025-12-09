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
                '/': 'Mateshwari Moorti Bhandar - Handcrafted Marble Idols & Temples',
                '/shop': 'Shop - Mateshwari Moorti Bhandar',
                '/cart': 'Shopping Cart - Mateshwari Moorti Bhandar',
                '/checkout': 'Checkout - Mateshwari Moorti Bhandar',
                '/profile': 'My Profile - Mateshwari Moorti Bhandar',
                '/orders': 'My Orders - Mateshwari Moorti Bhandar',
                '/wishlist': 'My Wishlist - Mateshwari Moorti Bhandar',
                '/contact': 'Contact Us - Mateshwari Moorti Bhandar',
                '/about': 'About Us - Mateshwari Moorti Bhandar',
                '/forgot-password': 'Forgot Password - Mateshwari Moorti Bhandar',
                '/reset-password': 'Reset Password - Mateshwari Moorti Bhandar'
            };

            const title = routeTitles[pathname] || 'Mateshwari Moorti Bhandar - Handcrafted Marble Idols & Temples';
            document.title = title;
        };

        updatePageTitle();
    }, [pathname, searchParams]);

    return null; // This component doesn't render anything
};

export default CanonicalURL;
