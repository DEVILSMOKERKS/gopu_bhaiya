import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart');
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    dispatch(addToWishlist(product.id));
    toast.success('Added to wishlist');
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/400x400?text=Product+Image';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToWishlist}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gold-50 transition-colors"
            >
              <FiHeart className="text-gray-700" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gold-50 transition-colors"
            >
              <FiShoppingCart className="text-gray-700" />
            </button>
          </div>
          {product.featured && (
            <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
          {product.dimensions && (
            <p className="text-sm text-gray-600 mb-2">{product.dimensions}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gold-600">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

