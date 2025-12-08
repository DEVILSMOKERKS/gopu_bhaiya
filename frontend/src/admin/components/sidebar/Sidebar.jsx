"use client";
import Link from "next/link";
import React, { useState } from 'react';
import { usePathname, useSearchParams } from "next/navigation";
import './adminSidebar.css';

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      path: '/admin/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      submenu: [
        {
          label: 'All Products',
          path: '/admin/products'
        },
        {
          label: 'Add Product',
          path: '/admin/products/create'
        }
      ]
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
        </svg>
      ),
      submenu: [
        {
          label: 'All Categories',
          path: '/admin/categories'
        },
        {
          label: 'Create Category',
          path: '/admin/categories/create'
        }
      ]
    },
    {
      id: 'subcategories',
      label: 'Subcategories',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"></path>
          <path d="M21 11h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"></path>
          <path d="M15 3H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
        </svg>
      ),
      submenu: [
        {
          label: 'All Subcategories',
          path: '/admin/subcategories'
        },
        {
          label: 'Create Subcategory',
          path: '/admin/subcategories/create'
        }
      ]
    },
    {
      id: 'offers',
      label: 'Special Offers',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"></path>
          <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
          <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
          <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
          <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
        </svg>
      ),
      submenu: [
        {
          label: 'All Offers',
          path: '/admin/offers'
        },
        {
          label: 'Create Offer',
          path: '/admin/offers/create'
        }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
      path: '/admin/orders'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      ),
      path: '/admin/reviews'
    },
    {
      id: 'blogs',
      label: 'Blog Management',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      ),
      path: '/admin/blogs'
    },
    {
      id: 'users',
      label: 'Users',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      path: '/admin/users'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
      submenu: [
        {
          label: 'Subscribers',
          path: '/admin/newsletter/subscribers'
        },
        {
          label: 'Send Email',
          path: '/admin/newsletter/send'
        },
        {
          label: 'Statistics',
          path: '/admin/newsletter/statistics'
        }
      ]
    }
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isMenuActive = (item) => {
    if (item.path) {
      return pathname === item.path;
    }
    if (item.submenu) {
      return item.submenu.some(subItem => pathname === subItem.path);
    }
    return false;
  };

  const isSubmenuActive = (submenuPath) => {
    return pathname === submenuPath;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && <div className="admin-sidebar-overlay" onClick={onMobileClose}></div>}

      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <h2>Mateshwari Moorti Bhandar Admin</h2>
          </div>

        </div>

        <nav className="admin-sidebar-nav">
          <ul className="admin-nav-menu">
            {menuItems.map((item) => (
              <li key={item.id} className={`admin-nav-item ${isMenuActive(item) ? 'active' : ''}`}>
                {item.submenu ? (
                  <>
                    <button
                      className={`admin-nav-link ${expandedMenus.includes(item.id) ? 'expanded' : ''}`}
                      onClick={() => toggleMenu(item.id)}
                    >
                      <span className="admin-nav-icon">{item.icon}</span>
                      <span className="admin-nav-label">{item.label}</span>
                      <svg
                        className={`admin-expand-icon ${expandedMenus.includes(item.id) ? 'expanded' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    <ul className={`admin-submenu ${expandedMenus.includes(item.id) ? 'expanded' : ''}`}>
                      {item.submenu.map((subItem, index) => (
                        <li key={index}>
                          <Link
                            href={subItem.path}
                            className={`admin-submenu-link ${isSubmenuActive(subItem.path) ? 'active' : ''}`}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className="admin-nav-link"
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    <span className="admin-nav-label">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              <div className="admin-avatar-placeholder">A</div>
            </div>
            <div className="admin-details">
              <h4>Admin User</h4>
              <p>Mateshvariexporter@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
