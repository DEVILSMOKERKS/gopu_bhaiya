'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await axios.get(`${API_URL}/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalUsers(response.data.data.pagination.totalUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage, searchTerm, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingStatus(userId);
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      const response = await axios.patch(`${API_URL}/admin/users/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(users.filter(user => user.id !== userId));
        setTotalUsers(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Blocked':
        return 'status-blocked';
      default:
        return 'status-unknown';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-users-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      {/* Header */}
      <div className="admin-users-header">
        <h1>User Management</h1>
        <p>Manage and monitor all registered users</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="analytics-dashboard">
        <div className="analytics-card">
          <h3>Total Users</h3>
          <div className="analytics-number">{totalUsers}</div>
          <span className="analytics-period">All time</span>
        </div>
        <div className="analytics-card">
          <h3>Active Users</h3>
          <div className="analytics-number">
            {users.filter(user => user.status === 'Active').length}
          </div>
          <span className="analytics-period">Currently active</span>
        </div>
        <div className="analytics-card">
          <h3>New Users</h3>
          <div className="analytics-number">
            {users.filter(user => {
              const userDate = new Date(user.created_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return userDate > thirtyDaysAgo;
            }).length}
          </div>
          <span className="analytics-period">Last 30 days</span>
        </div>
        <div className="analytics-card">
          <h3>Inactive Users</h3>
          <div className="analytics-number">
            {users.filter(user => user.status === 'Inactive').length}
          </div>
          <span className="analytics-period">Requires attention</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Per Page:</label>
          <select
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="users-grid-container">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchUsers}>Try Again</button>
          </div>
        )}

        {/* Grid Headers */}
        <div className="grid-headers">
          <div className="grid-header">User</div>
          <div className="grid-header">Email</div>
          <div className="grid-header">Phone</div>
          <div className="grid-header">Status</div>
          <div className="grid-header">Joined Date</div>
          <div className="grid-header">Actions</div>
        </div>

        {/* Grid Rows */}
        {users.map((user) => (
          <div key={user.id} className="grid-row">
            <div className="grid-cell user-info" data-label="User">
              <div className="user-avatar">
                {user.photo ? (
                  <Image src={user.photo} alt={user.name} />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <p className="customer-name">{user.name}</p>
                <p className="customer-email">ID: {user.id}</p>
              </div>
            </div>
            <div className="grid-cell user-email" data-label="Email">{user.email}</div>
            <div className="grid-cell user-phone" data-label="Phone">{user.phone || 'N/A'}</div>
            <div className="grid-cell user-status" data-label="Status">
              <select
                value={user.status}
                onChange={(e) => handleStatusChange(user.id, e.target.value)}
                className={`status-select ${getStatusBadgeClass(user.status)}`}
                disabled={updatingStatus === user.id}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
              {updatingStatus === user.id && (
                <span className="updating-indicator">Updating...</span>
              )}
            </div>
            <div className="grid-cell user-date" data-label="Joined Date">{formatDate(user.created_at)}</div>
            <div className="grid-cell user-actions" data-label="Actions">
              <div className="action-buttons">
                <button
                  onClick={() => viewUserDetails(user)}
                  className="view-btn"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && !loading && (
          <div className="no-users-message">
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              {/* User Summary */}
              <div className="user-summary-section">
                <h3>User Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>User ID:</span>
                    <span>{selectedUser.id}</span>
                  </div>
                  <div className="summary-item">
                    <span>Name:</span>
                    <span>{selectedUser.name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Email:</span>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="summary-item">
                    <span>Phone:</span>
                    <span>{selectedUser.phone || 'Not provided'}</span>
                  </div>
                  <div className="summary-item">
                    <span>Status:</span>
                    <span className={`status-badge status-${selectedUser.status.toLowerCase()}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span>Joined Date:</span>
                    <span>{formatDate(selectedUser.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="user-details-section">
                <h3>Additional Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Date of Birth:</label>
                    <span>{selectedUser.dob ? formatDate(selectedUser.dob) : 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Anniversary:</label>
                    <span>{selectedUser.anniversary ? formatDate(selectedUser.anniversary) : 'Not provided'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Address:</label>
                    <span>{selectedUser.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
