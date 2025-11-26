import { configureStore } from '@reduxjs/toolkit';
import cartWishlistReducer from './slices/cartWishlistSlice';

export const store = configureStore({
  reducer: {
    cartWishlist: cartWishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['cartWishlist/loadFromLocalStorage'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['cartWishlist.lastUpdated'],
      },
    }),
});
