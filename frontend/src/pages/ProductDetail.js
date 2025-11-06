import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { FiHeart, FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [customizationForm, setCustomizationForm] = useState({
    size: '',
    designPreferences: '',
    additionalNotes: '',
  });
  const [showCustomization, setShowCustomization] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!currentProduct) return;
    dispatch(addToCart({ product: currentProduct, quantity }));
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    dispatch(addToWishlist(id));
    toast.success('Added to wishlist');
  };

  const handleCustomizationSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit customization request');
      return;
    }

    try {
      await api.post('/custom-requests', {
        designDescription: customizationForm.designPreferences,
        dimensions: customizationForm.size,
        notes: customizationForm.additionalNotes,
      });
      toast.success('Customization request submitted successfully');
      setCustomizationForm({ size: '', designPreferences: '', additionalNotes: '' });
      setShowCustomization(false);
    } catch (error) {
      toast.error('Failed to submit customization request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const images = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images.map(img => ({ original: img, thumbnail: img }))
    : [{ original: 'https://via.placeholder.com/800x600?text=Product+Image', thumbnail: 'https://via.placeholder.com/150x150?text=Thumb' }];

  const stars = Array.from({ length: 5 }, (_, i) => (
    <FiStar
      key={i}
      className={
        i < Math.floor(currentProduct.avgRating || 0)
          ? 'text-gold-500 fill-current'
          : 'text-gray-300'
      }
    />
  ));

  return (
    <>
      <Helmet>
        <title>{currentProduct.name} - Mateshwari Exports</title>
        <meta name="description" content={currentProduct.description} />
      </Helmet>

      <div className="section-padding bg-white min-h-screen">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <ImageGallery
                items={images}
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-gold-600 font-semibold">
                  {currentProduct.category}
                </span>
              </div>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                {currentProduct.name}
              </h1>

              {/* Rating */}
              {currentProduct.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{stars}</div>
                  <span className="text-gray-600">
                    {currentProduct.avgRating} ({currentProduct.reviewCount} reviews)
                  </span>
                </div>
              )}

              <div className="text-4xl font-bold text-gold-600 mb-6">
                ₹{currentProduct.price.toLocaleString('en-IN')}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {currentProduct.description || 'A divine masterpiece crafted with precision and devotion.'}
              </p>

              {/* Product Details */}
              <div className="border-t border-b border-gray-200 py-6 mb-6 space-y-3">
                {currentProduct.material && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Material:</span>
                    <span className="text-gray-600">{currentProduct.material}</span>
                  </div>
                )}
                {currentProduct.dimensions && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Dimensions:</span>
                    <span className="text-gray-600">{currentProduct.dimensions}</span>
                  </div>
                )}
                {currentProduct.finish && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-32">Finish:</span>
                    <span className="text-gray-600">{currentProduct.finish}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-32">Stock:</span>
                  <span className={currentProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {currentProduct.stock > 0 ? `In Stock (${currentProduct.stock} available)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Quantity & Actions */}
              {currentProduct.stock > 0 && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <label className="font-semibold text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-6 py-2">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                    <button onClick={handleAddToWishlist} className="btn-secondary px-6">
                      <FiHeart />
                    </button>
                  </div>
                </>
              )}

              {/* Virtual View Button */}
              <button
                onClick={() => navigate('/virtual-showroom')}
                className="btn-secondary w-full mb-6"
              >
                Experience Virtual View
              </button>

              {/* Customization Request */}
              <div className="border-t pt-6">
                <button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="text-gold-600 hover:text-gold-700 font-semibold mb-4"
                >
                  {showCustomization ? 'Hide' : 'Request Customization'}
                </button>

                {showCustomization && (
                  <form onSubmit={handleCustomizationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Size
                      </label>
                      <input
                        type="text"
                        value={customizationForm.size}
                        onChange={(e) => setCustomizationForm({ ...customizationForm, size: e.target.value })}
                        placeholder="e.g., 12x12x18 inches"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Design Preferences
                      </label>
                      <textarea
                        value={customizationForm.designPreferences}
                        onChange={(e) => setCustomizationForm({ ...customizationForm, designPreferences: e.target.value })}
                        rows="4"
                        placeholder="Describe your design preferences..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={customizationForm.additionalNotes}
                        onChange={(e) => setCustomizationForm({ ...customizationForm, additionalNotes: e.target.value })}
                        rows="3"
                        placeholder="Any additional requirements..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Submit Customization Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {currentProduct.reviews && currentProduct.reviews.length > 0 && (
            <div className="mt-12 border-t pt-12">
              <h2 className="text-3xl font-heading font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {currentProduct.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            className={
                              i < review.rating
                                ? 'text-gold-500 fill-current'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.User?.name || 'Anonymous'}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

