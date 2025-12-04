'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useWishlistCart } from '../../../context/wishlistCartContext';
import { sampleProducts } from '../../../data/productsData';
import './DirectFromMakersHands.css';

const DirectFromMakersHands = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const desktopScrollRef = useRef(null);
    const router = useRouter();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistCart();

    useEffect(() => {
        // Fetch products from productsData.js
        setProducts(sampleProducts);
        setLoading(false);
    }, []);

    const getProductImage = (product) => {
        // Get image from direct images key
        if (product.images && product.images.length > 0) {
            const image = product.images[0];
            // If image is an imported module (not a string), return it directly
            if (typeof image !== 'string') {
                return image;
            }
            // If it's a string path, return it as is
            return image;
        }
        return 'https://via.placeholder.com/300x400/8B4513/FFFFFF?text=Product';
    };

    const handleWishlistToggle = (e, product) => {
        e.stopPropagation();
        if (isInWishlist(product.product_id)) {
            removeFromWishlist(product.product_id);
        } else {
            addToWishlist(product);
        }
    };

    const handleProductClick = (productId, e) => {
        // Prevent navigation if user was dragging
        if (isDragging) {
            return;
        }
        router.push(`/product/${productId}`);
    };

    const handleViewAll = () => {
        router.push('/shop');
    };

    const scrollDesktopToPage = (pageIndex) => {
        if (desktopScrollRef.current) {
            const cardWidth = desktopScrollRef.current.querySelector('.direct-makers-hands-card')?.offsetWidth || 0;
            const gap = 30;
            const cardsPerPage = 3;
            const scrollAmount = (cardWidth + gap) * cardsPerPage * pageIndex;

            desktopScrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Prevent scroll on click, allow drag scroll
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        if (desktopScrollRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - desktopScrollRef.current.offsetLeft);
            setScrollLeft(desktopScrollRef.current.scrollLeft);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !desktopScrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - desktopScrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        desktopScrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // For mobile: calculate pagination
    const itemsPerPage = 2;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const mobileProducts = products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Desktop: show all products (3 per row)
    const desktopProducts = products;

    // Calculate desktop pagination dots (3 products per page)
    const desktopItemsPerPage = 3;
    const desktopTotalPages = Math.ceil(products.length / desktopItemsPerPage);
    const [desktopCurrentPage, setDesktopCurrentPage] = useState(0);

    if (loading) {
        return (
            <section className="direct-makers-hands">
                <div className="direct-makers-hands-container">
                    <div className="direct-makers-hands-header">
                        <h2 className="direct-makers-hands-title">Direct From The Makers' Hands</h2>
                        <button className="direct-makers-hands-view-all" onClick={handleViewAll}>
                            View All
                        </button>
                    </div>
                    <div className="direct-makers-hands-loading">Loading...</div>
                </div>
            </section>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <section className="direct-makers-hands">
                <div className="direct-makers-hands-container">
                    <div className="direct-makers-hands-header">
                        <h2 className="direct-makers-hands-title">Direct From The Makers' Hands</h2>
                        <button className="direct-makers-hands-view-all" onClick={handleViewAll}>
                            View All
                        </button>
                    </div>
                    <div className="direct-makers-hands-empty-state">
                        <div className="direct-makers-hands-empty-icon-wrapper">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 21V13C16 11.8954 15.1046 11 14 11H10C8.89543 11 8 11.8954 8 13V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 10L12 15L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="direct-makers-hands-empty-title">No Products Available</h3>
                        <p className="direct-makers-hands-empty-message">
                            We're currently updating our collection. Please check back soon for new arrivals.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="direct-makers-hands">
            <div className="direct-makers-hands-container">
                <div className="direct-makers-hands-header">
                    <h2 className="direct-makers-hands-title">Direct From The Makers' Hands</h2>
                    <button className="direct-makers-hands-view-all" onClick={handleViewAll}>
                        View All
                    </button>
                </div>

                {/* Desktop: Show 3 products with horizontal scroll */}
                <div className="direct-makers-hands-desktop-wrapper">
                    <div
                        className="direct-makers-hands-grid-desktop"
                        ref={desktopScrollRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onScroll={() => {
                            // Update current page based on scroll position
                            if (desktopScrollRef.current) {
                                const cardWidth = desktopScrollRef.current.querySelector('.direct-makers-hands-card')?.offsetWidth || 0;
                                const gap = 30;
                                const cardsPerPage = 3;
                                const scrollLeft = desktopScrollRef.current.scrollLeft;
                                const pageWidth = (cardWidth + gap) * cardsPerPage;
                                const currentPage = Math.round(scrollLeft / pageWidth);
                                setDesktopCurrentPage(Math.min(currentPage, desktopTotalPages - 1));
                            }
                        }}
                    >
                        {desktopProducts.map((product) => (
                            <div
                                key={product.product_id}
                                className="direct-makers-hands-card"
                                onClick={(e) => handleProductClick(product.product_id, e)}
                            >
                                <div className="direct-makers-hands-image-wrapper">
                                    <img
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        className="direct-makers-hands-image"
                                    />
                                    <button
                                        className="direct-makers-hands-wishlist-btn"
                                        onClick={(e) => handleWishlistToggle(e, product)}
                                        aria-label="Add to wishlist"
                                    >
                                        {isInWishlist(product.product_id) ? (
                                            <HiHeart className="direct-makers-hands-wishlist-icon filled" />
                                        ) : (
                                            <HiOutlineHeart className="direct-makers-hands-wishlist-icon" />
                                        )}
                                    </button>
                                </div>
                                <h3 className="direct-makers-hands-card-title">{product.name}</h3>
                                <p className="direct-makers-hands-card-description">
                                    {product.description || 'Lorem Ipsum To Add....'}
                                </p>
                                <p className="direct-makers-hands-card-price">₹{product.min_price ? product.min_price.toLocaleString('en-IN') : '1,80000'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile: Show 2 products with pagination */}
                <div className="direct-makers-hands-grid-mobile">
                    {mobileProducts.map((product) => (
                        <div
                            key={product.product_id}
                            className="direct-makers-hands-card"
                            onClick={() => handleProductClick(product.product_id)}
                        >
                            <div className="direct-makers-hands-image-wrapper">
                                <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="direct-makers-hands-image"
                                />
                                <button
                                    className="direct-makers-hands-wishlist-btn"
                                    onClick={(e) => handleWishlistToggle(e, product)}
                                    aria-label="Add to wishlist"
                                >
                                    {isInWishlist(product.product_id) ? (
                                        <HiHeart className="direct-makers-hands-wishlist-icon filled" />
                                    ) : (
                                        <HiOutlineHeart className="direct-makers-hands-wishlist-icon" />
                                    )}
                                </button>
                            </div>
                            <h3 className="direct-makers-hands-card-title">{product.name}</h3>
                            <p className="direct-makers-hands-card-description">
                                {product.description || 'Lorem Ipsum To Add....'}
                            </p>
                            <p className="direct-makers-hands-card-price">₹{product.min_price ? product.min_price.toLocaleString('en-IN') : '1,80000'}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots - Desktop: based on total pages */}
                {desktopTotalPages > 1 && (
                    <div className="direct-makers-hands-pagination direct-makers-hands-pagination-desktop">
                        {Array.from({ length: desktopTotalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={`direct-makers-hands-dot ${desktopCurrentPage === index ? 'active' : ''}`}
                                onClick={() => {
                                    setDesktopCurrentPage(index);
                                    scrollDesktopToPage(index);
                                }}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                    <div className="direct-makers-hands-pagination direct-makers-hands-pagination-mobile">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={`direct-makers-hands-dot ${currentPage === index ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DirectFromMakersHands;

