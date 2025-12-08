import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - Next.js compatible
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get auth token (SSR safe)
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper function to check if user is logged in (SSR safe)
const isUserLoggedIn = () => {
  return !!getAuthToken();
};

// Helper function to get localStorage data (SSR safe)
const getLocalStorageData = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error parsing localStorage ${key}:`, error);
    return [];
  }
};

// Helper function to set localStorage data (SSR safe)
const setLocalStorageData = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting localStorage ${key}:`, error);
  }
};

// Async thunks for API calls
export const addToCartAPI = createAsyncThunk(
  'cartWishlist/addToCartAPI',
  async ({ product_id, color_id, size_id, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { product_id, color_id, size_id, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const getCartAPI = createAsyncThunk(
  'cartWishlist/getCartAPI',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get cart');
    }
  }
);

export const updateCartItemAPI = createAsyncThunk(
  'cartWishlist/updateCartItemAPI',
  async ({ cart_id, quantity }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/cart/${cart_id}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update cart item');
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cartWishlist/removeFromCartAPI',
  async (cart_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_BASE_URL}/cart/${cart_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return cart_id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove from cart');
    }
  }
);

export const addToWishlistAPI = createAsyncThunk(
  'cartWishlist/addToWishlistAPI',
  async (product_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/wishlist/add`,
        { product_id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to wishlist');
    }
  }
);

export const getWishlistAPI = createAsyncThunk(
  'cartWishlist/getWishlistAPI',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get wishlist');
    }
  }
);

export const removeFromWishlistAPI = createAsyncThunk(
  'cartWishlist/removeFromWishlistAPI',
  async (wishlist_id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_BASE_URL}/wishlist/${wishlist_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return wishlist_id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove from wishlist');
    }
  }
);

// Initial state
const initialState = {
  cart: {
    items: [],
    summary: {
      total_items: 0,
      total_price: 0,
      total_discount: 0,
      total_actual_price: 0
    }
  },
  wishlist: {
    items: [],
    total_items: 0
  },
  loading: false,
  error: null,
  lastUpdated: null
};

// Cart and Wishlist Slice
const cartWishlistSlice = createSlice({
  name: 'cartWishlist',
  initialState,
  reducers: {
    // Local storage actions
    addToCartLocal: (state, action) => {
      const { product_id, color_id, size_id, quantity = 1, product, size_name, color_name, sell_price } = action.payload;

      // Check if item already exists
      const existingItemIndex = state.cart.items.findIndex(
        item => item.product_id === product_id &&
          item.color_id === color_id &&
          item.size_id === size_id
      );

      if (existingItemIndex !== -1) {
        // Update quantity
        state.cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem = {
          cart_id: Date.now(), // Temporary ID for local storage
          product_id,
          color_id,
          size_id,
          quantity,
          product,
          size_name: size_name || 'Standard',
          color_name: color_name || 'Default',
          sell_price: sell_price || product?.price || 0,
          created_at: new Date().toISOString()
        };
        state.cart.items.push(newItem);
      }

      // Update summary
      state.cart.summary = calculateCartSummary(state.cart.items);

      // Save to localStorage
      setLocalStorageData('cart', state.cart.items);
      state.lastUpdated = new Date().toISOString();
    },

    updateCartItemLocal: (state, action) => {
      const { cart_id, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.cart_id === cart_id);

      if (itemIndex !== -1) {
        state.cart.items[itemIndex].quantity = quantity;
        state.cart.summary = calculateCartSummary(state.cart.items);
        setLocalStorageData('cart', state.cart.items);
        state.lastUpdated = new Date().toISOString();
      }
    },

    removeFromCartLocal: (state, action) => {
      const cart_id = action.payload;
      state.cart.items = state.cart.items.filter(item => item.cart_id !== cart_id);
      state.cart.summary = calculateCartSummary(state.cart.items);
      setLocalStorageData('cart', state.cart.items);
      state.lastUpdated = new Date().toISOString();
    },

    addToWishlistLocal: (state, action) => {
      const { product_id, product } = action.payload;

      // Check if already in wishlist
      const exists = state.wishlist.items.some(item => item.product_id === product_id);

      if (!exists) {
        // Ensure product has proper structure for local storage
        const normalizedProduct = {
          ...product,
          name: product.name || 'Product Name Not Available',
          description: product.description || 'Product description not available',
          price: product.price || product.min_price || 0,
          min_price: product.min_price || product.price || 0,
          colors: product.colors || [],
          sizes: product.sizes || []
        };

        state.wishlist.items.push({
          wishlist_id: Date.now(), // Temporary ID for local storage
          product_id,
          product: normalizedProduct,
          created_at: new Date().toISOString()
        });
        state.wishlist.total_items = state.wishlist.items.length;
        setLocalStorageData('wishlist', state.wishlist.items);
        state.lastUpdated = new Date().toISOString();
      }
    },

    removeFromWishlistLocal: (state, action) => {
      const wishlist_id = action.payload;
      state.wishlist.items = state.wishlist.items.filter(item => item.wishlist_id !== wishlist_id);
      state.wishlist.total_items = state.wishlist.items.length;
      setLocalStorageData('wishlist', state.wishlist.items);
      state.lastUpdated = new Date().toISOString();
    },

    loadFromLocalStorage: (state) => {
      const cartItems = getLocalStorageData('cart');
      const wishlistItems = getLocalStorageData('wishlist');

      // Ensure cart items have the correct structure
      const migratedCartItems = cartItems.map(item => ({
        ...item,
        size_name: item.size_name || item.size || 'Standard',
        color_name: item.color_name || item.color || 'Default',
        sell_price: item.sell_price || item.product?.price || 0
      }));

      // Ensure wishlist items have the correct structure
      const migratedWishlistItems = wishlistItems.map(item => {
        if (item.product) {
          // Ensure product has proper structure
          const normalizedProduct = {
            ...item.product,
            name: item.product.name || 'Product Name Not Available',
            description: item.product.description || 'Product description not available',
            price: item.product.price || item.product.min_price || 0,
            min_price: item.product.min_price || item.product.price || 0,
            colors: item.product.colors || [],
            sizes: item.product.sizes || []
          };
          return {
            ...item,
            product: normalizedProduct
          };
        }
        return item;
      });

      state.cart.items = migratedCartItems;
      state.cart.summary = calculateCartSummary(migratedCartItems);
      state.wishlist.items = migratedWishlistItems;
      state.wishlist.total_items = migratedWishlistItems.length;
      state.lastUpdated = new Date().toISOString();

      // Update localStorage with migrated data
      setLocalStorageData('cart', migratedCartItems);
      setLocalStorageData('wishlist', migratedWishlistItems);
    },

    clearCart: (state) => {
      state.cart.items = [];
      state.cart.summary = {
        total_items: 0,
        total_price: 0,
        total_discount: 0,
        total_actual_price: 0
      };
      setLocalStorageData('cart', []);
      state.lastUpdated = new Date().toISOString();
    },

    clearWishlist: (state) => {
      state.wishlist.items = [];
      state.wishlist.total_items = 0;
      setLocalStorageData('wishlist', []);
      state.lastUpdated = new Date().toISOString();
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // API Cart actions
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh cart data from API
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAPI.fulfilled, (state) => {
        state.loading = false;
        // Refresh cart data from API
      })
      .addCase(updateCartItemAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAPI.fulfilled, (state) => {
        state.loading = false;
        // Refresh cart data from API
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // API Wishlist actions
      .addCase(addToWishlistAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAPI.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh wishlist data from API
      })
      .addCase(addToWishlistAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWishlistAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlistAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.data;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getWishlistAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistAPI.fulfilled, (state) => {
        state.loading = false;
        // Refresh wishlist data from API
      })
      .addCase(removeFromWishlistAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function to calculate cart summary
const calculateCartSummary = (items) => {
  let totalItems = 0;
  let totalPrice = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const price = item.sell_price || item.product?.price || 0;
    const actualPrice = item.actual_price || price;

    totalItems += 1; // Count products, not quantities
    totalPrice += price * item.quantity;
    totalDiscount += (actualPrice - price) * item.quantity;
  });

  return {
    total_items: totalItems,
    total_price: totalPrice,
    total_discount: totalDiscount,
    total_actual_price: totalPrice + totalDiscount
  };
};

export const {
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
} = cartWishlistSlice.actions;

export default cartWishlistSlice.reducer;
