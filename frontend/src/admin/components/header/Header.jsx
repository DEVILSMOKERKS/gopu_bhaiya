import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../../../context/AdminContext';
import './adminHeader.css';

const Header = ({ adminUser, onLogout, onToggleMobileSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAdmin();

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    // Fetch notifications
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      if (!token) return;

      const response = await axios.get(`${API_URL}/admin/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      if (!token) return;

      await axios.put(`${API_URL}/admin/notifications/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-sidebar-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle mobile sidebar"
        >
          <span className="admin-hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className="admin-search-container">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            <button type="submit" className="admin-search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="admin-header-right">
        {/* Notifications */}
        <div className="admin-notifications-container">
          <button
            className="admin-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="admin-notification-badge">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="admin-notifications-dropdown">
              <div className="admin-notifications-header">
                <h3>Notifications</h3>
                <button
                  className="admin-mark-all-read"
                  onClick={() => {
                    notifications.forEach(n => markNotificationAsRead(n.id));
                  }}
                >
                  Mark all read
                </button>
              </div>
              <div className="admin-notifications-list">
                {notifications.length === 0 ? (
                  <div className="admin-no-notifications">
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`admin-notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="admin-notification-content">
                        <p className="admin-notification-text">{notification.message}</p>
                        <span className="admin-notification-time">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="admin-profile-container">
          <button
            className="admin-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profile menu"
          >
            <div className="admin-profile-avatar">
              {adminUser?.photo ? (
                <img src={adminUser.photo} alt={adminUser.name} />
              ) : (
                <div className="admin-avatar-placeholder">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <span className="admin-profile-name">{adminUser?.name || 'Admin'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>

          {showProfileMenu && (
            <div className="admin-profile-dropdown">
              <div className="admin-profile-info">
                <div className="admin-profile-avatar-large">
                  {adminUser?.photo ? (
                    <img src={adminUser.photo} alt={adminUser.name} />
                  ) : (
                    <div className="admin-avatar-placeholder">
                      {adminUser?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                <div className="admin-profile-details">
                  <h4>{adminUser?.name || 'Admin User'}</h4>
                  <p>{adminUser?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <div className="admin-profile-menu-items">
                <button className="admin-menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </button>
                <button className="admin-menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Settings
                </button>
                <button className="admin-menu-item" onClick={onLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
