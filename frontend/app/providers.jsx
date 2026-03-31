'use client';

import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { UserProvider } from '../src/context/UserContext';
import { WishlistCartProvider } from '../src/context/wishlistCartContext';
import { NotificationProvider } from '../src/context/NotificationContext';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <UserProvider>
          <WishlistCartProvider>{children}</WishlistCartProvider>
        </UserProvider>
      </NotificationProvider>
    </Provider>
  );
}
