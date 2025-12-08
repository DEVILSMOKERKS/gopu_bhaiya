import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Routes, Route } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import Header from '../admin/components/header/Header'
import Sidebar from '../admin/components/sidebar/Sidebar'
import AdminAuthPopup from '../admin/components/auth-popup/AdminAuthPopup'
import Dashboard from "../admin/pages/Dashboard/Dashboard"
import ResetPassword from "../admin/pages/ResetPassword/ResetPassword"

import AdminLayout from '../admin/components/AdminLayout';

// This component is not used in Next.js file-based routing
const AdminRoute = () => {
  return null;
}

export default AdminRoute;
export { AdminLayout };
