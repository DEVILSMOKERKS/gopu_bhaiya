import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { FiHeart, FiShoppingCart, FiX } from 'react-icons/fi';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    await dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - Mateshwari Exports</title>
      </Helmet>

      <div className="section-padding bg-gray-50 min-h-screen">
        <div className="container-custom">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8">My Wishlist</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FiHeart className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
              <Link to="/shop" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x400'}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(product.id);
                        }}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <FiX className="text-red-500" />
                      </button>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-heading font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-gold-600 mb-4">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;

