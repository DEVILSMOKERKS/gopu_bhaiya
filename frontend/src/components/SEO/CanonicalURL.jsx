import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalURL = () => {
    const location = useLocation();

    useEffect(() => {
        // Get current URL with search params if any
        const currentUrl = window.location.origin + location.pathname + location.search;

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
                '/': 'Saanz - Premium Fashion & Lifestyle',
                '/shop': 'Shop - Saanz',
                '/cart': 'Shopping Cart - Saanz',
                '/checkout': 'Checkout - Saanz',
                '/profile': 'My Profile - Saanz',
                '/orders': 'My Orders - Saanz',
                '/wishlist': 'My Wishlist - Saanz',
                '/contact': 'Contact Us - Saanz',
                '/about': 'About Us - Saanz',
                '/forgot-password': 'Forgot Password - Saanz',
                '/reset-password': 'Reset Password - Saanz'
            };

            const title = routeTitles[location.pathname] || 'Saanz - Premium Fashion & Lifestyle';
            document.title = title;
        };

        updatePageTitle();
    }, [location.pathname, location.search]);

    return null; // This component doesn't render anything
};

export default CanonicalURL;
