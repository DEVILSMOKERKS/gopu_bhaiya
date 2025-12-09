'use client';

import { AdminProvider } from '../../src/context/AdminContext';
import { NotificationProvider } from '../../src/context/NotificationContext';
import AdminLayout from '../../src/admin/components/AdminLayout';

export default function AdminLayoutWrapper({ children }) {
  return (
    <NotificationProvider>
      <AdminProvider>
        <AdminLayout>
          {children}
        </AdminLayout>
      </AdminProvider>
    </NotificationProvider>
  );
}





