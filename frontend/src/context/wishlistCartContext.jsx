import { createContext, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCartAPI,
  getCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  addToWishlistAPI,
  getWishlistAPI,
  removeFromWishlistAPI,
  addToCartLocal,
  updateCartItemLocal,
  removeFromCartLocal,
  addToWishlistLocal,
  removeFromWishlistLocal,
  loadFromLocalStorage,
  clearCart,
  clearWishlist,
  setError,
  clearError
} from '../store/slices/cartWishlistSlice';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Create context
const WishlistCartContext = createContext();

// Default context value for SSR
const defaultWishlistCartValue = {
  cart: { items: [], total: 0, count: 0 },
  wishlist: { items: [], count: 0 },
  loading: false,
  error: null,
  addToCart: async () => { },
  buyNow: async () => { },
  updateCartItem: async () => { },
  removeFromCart: async () => { },
  addToWishlist: async () => { },
  removeFromWishlist: async () => { },
  removeFromWishlistByProduct: async () => { },
  clearCart: () => { },
  clearWishlist: () => { },
  clearError: () => { },
  syncLocalStorageToAPI: async () => { },
  isInWishlist: () => false,
  isInCart: () => false,
  getCartItemQuantity: () => 0,
  isUserLoggedIn: () => false
};

// Custom hook to use the context (SSR-safe)
export const useWishlistCart = () => {
  const context = useContext(WishlistCartContext);
  // Return default values during SSR if context is not available
  if (!context) {
    if (typeof window === 'undefined') {
      return defaultWishlistCartValue;
    }
    throw new Error('useWishlistCart must be used within a WishlistCartProvider');
  }
  return context;
};

// Provider component
export const WishlistCartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { cart, wishlist, loading, error } = useSelector((state) => state.cartWishlist);

  // Load data from localStorage on mount
  useEffect(() => {
    dispatch(loadFromLocalStorage());
  }, [dispatch]);

  // Load data from API if user is logged in
  useEffect(() => {
    if (isUserLoggedIn()) {
      dispatch(getCartAPI());
      dispatch(getWishlistAPI());
    }
  }, [dispatch]);

  // Add to cart function
  const addToCart = useCallback(async (productData) => {
    const { product_id, color_id, size_id, quantity = 1, product, size_name, color_name, sell_price } = productData;

    try {
      if (isUserLoggedIn()) {
        // User is logged in - use API
        await dispatch(addToCartAPI({ product_id, color_id, size_id, quantity })).unwrap();
        // Refresh cart data from API
        dispatch(getCartAPI());
      } else {
        // User is not logged in - use localStorage
        dispatch(addToCartLocal({ product_id, color_id, size_id, quantity, product, size_name, color_name, sell_price }));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch(setError(error.message || 'Failed to add to cart'));
    }
  }, [dispatch]);

  // Buy Now function - adds to cart and prepares for direct checkout
  const buyNow = useCallback(async (productData, router) => {
    const { product_id, color_id, size_id, quantity = 1, product, size_name, color_name, sell_price } = productData;

    try {
      if (isUserLoggedIn()) {
        // User is logged in - use API
        await dispatch(addToCartAPI({ product_id, color_id, size_id, quantity })).unwrap();
        // Refresh cart data from API
        dispatch(getCartAPI());
      } else {
        // User is not logged in - use localStorage
        dispatch(addToCartLocal({ product_id, color_id, size_id, quantity, product, size_name, color_name, sell_price }));
      }

      // Navigation to checkout should be handled by the component using router
      router.push('/checkout');
    } catch (error) {
      console.error('Error in buy now:', error);
      dispatch(setError(error.message || 'Failed to process buy now'));
    }
  }, [dispatch]);

  // Update cart item quantity
  const updateCartItem = useCallback(async (cart_id, quantity) => {
    try {
      if (isUserLoggedIn()) {
        // User is logged in - use API
        await dispatch(updateCartItemAPI({ cart_id, quantity })).unwrap();
        // Refresh cart data from API
        dispatch(getCartAPI());
      } else {
        // User is not logged in - use localStorage
        dispatch(updateCartItemLocal({ cart_id, quantity }));
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch(setError(error.message || 'Failed to update cart item'));
    }
  }, [dispatch]);

  // Remove from cart
  const removeFromCart = useCallback(async (cart_id) => {
    try {
      if (isUserLoggedIn()) {
        // User is logged in - use API
        await dispatch(removeFromCartAPI(cart_id)).unwrap();
        // Refresh cart data from API
        dispatch(getCartAPI());
      } else {
        // User is not logged in - use localStorage
        dispatch(removeFromCartLocal(cart_id));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch(setError(error.message || 'Failed to remove from cart'));
    }
  }, [dispatch]);

  // Add to wishlist
  const addToWishlist = useCallback(async (productData) => {
    const { product_id, product } = productData;

    try {
      if (isUserLoggedIn()) {
        // User is logged in - use API
        await dispatch(addToWishlistAPI(product_id)).unwrap();
        // Refresh wishlist data from API
        dispatch(getWishlistAPI());
      } else {
        // User is not logged in - use localStorage
        dispatch(addToWishlistLocal({ product_id, product }));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      dispatch(setError(error.message || 'Failed to add to wishlist'));
    }
  }, [dispatch]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (wishlist_id) => {
    try {
      if (isUserLoggedIn()) {
        // User is logged in - use API
        await dispatch(removeFromWishlistAPI(wishlist_id)).unwrap();
        // Refresh wishlist data from API
        dispatch(getWishlistAPI());
      } else {
        // User is not logged in - use localStorage
        dispatch(removeFromWishlistLocal(wishlist_id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      dispatch(setError(error.message || 'Failed to remove from wishlist'));
    }
  }, [dispatch]);

  // Remove from wishlist by product ID
  const removeFromWishlistByProduct = useCallback(async (product_id) => {
    try {
      if (isUserLoggedIn()) {

      } else {
        // User is not logged in - use localStorage
        const wishlistItem = wishlist.items.find(item => item.product_id === product_id);
        if (wishlistItem) {
          dispatch(removeFromWishlistLocal(wishlistItem.wishlist_id));
        }
      }
    } catch (error) {
      console.error('Error removing from wishlist by product:', error);
      dispatch(setError(error.message || 'Failed to remove from wishlist'));
    }
  }, [dispatch, wishlist.items]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((product_id) => {
    return wishlist.items.some(item => item.product_id === product_id);
  }, [wishlist.items]);

  // Check if product is in cart
  const isInCart = useCallback((product_id, color_id = null, size_id = null) => {
    return cart.items.some(item =>
      item.product_id === product_id &&
      item.color_id === color_id &&
      item.size_id === size_id
    );
  }, [cart.items]);

  // Get cart item quantity
  const getCartItemQuantity = useCallback((product_id, color_id = null, size_id = null) => {
    const item = cart.items.find(item =>
      item.product_id === product_id &&
      item.color_id === color_id &&
      item.size_id === size_id
    );
    return item ? item.quantity : 0;
  }, [cart.items]);

  // Clear cart
  const clearCartData = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  // Clear wishlist
  const clearWishlistData = useCallback(() => {
    dispatch(clearWishlist());
  }, [dispatch]);

  // Clear error
  const clearErrorData = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Sync localStorage to API when user logs in
  const syncLocalStorageToAPI = useCallback(async () => {
    if (!isUserLoggedIn()) return;

    try {
      // Get localStorage data
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      // Sync cart items
      for (const item of localCart) {
        try {
          await dispatch(addToCartAPI({
            product_id: item.product_id,
            color_id: item.color_id,
            size_id: item.size_id,
            quantity: item.quantity
          })).unwrap();
        } catch (error) {
          console.error('Error syncing cart item:', error);
        }
      }

      // Sync wishlist items
      for (const item of localWishlist) {
        try {
          await dispatch(addToWishlistAPI(item.product_id)).unwrap();
        } catch (error) {
          console.error('Error syncing wishlist item:', error);
        }
      }

      // Clear localStorage after successful sync
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');

      // Refresh data from API
      dispatch(getCartAPI());
      dispatch(getWishlistAPI());

    } catch (error) {
      console.error('Error syncing localStorage to API:', error);
    }
  }, [dispatch]);

  // Context value
  const contextValue = {
    // State
    cart,
    wishlist,
    loading,
    error,

    // Actions
    addToCart,
    buyNow,
    updateCartItem,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByProduct,
    clearCart: clearCartData,
    clearWishlist: clearWishlistData,
    clearError: clearErrorData,
    syncLocalStorageToAPI,

    // Utility functions
    isInWishlist,
    isInCart,
    getCartItemQuantity,
    isUserLoggedIn
  };

  return (
    <WishlistCartContext.Provider value={contextValue}>
      {children}
    </WishlistCartContext.Provider>
  );
};
