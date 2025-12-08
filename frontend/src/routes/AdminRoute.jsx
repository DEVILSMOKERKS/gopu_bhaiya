// Note: In Next.js, routing is file-based, so Routes/Route from react-router-dom are not used.
// This file is kept for backward compatibility but routing is handled by Next.js app directory.
// AdminLayout is exported from its own file: src/admin/components/AdminLayout.jsx

import AdminLayout from '../admin/components/AdminLayout';

// This component is not used in Next.js file-based routing
const AdminRoute = () => {
  return null;
}

export default AdminRoute;
export { AdminLayout };
