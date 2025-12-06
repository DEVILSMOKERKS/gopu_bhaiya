'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactManagement.css';

const API_URL = import.meta.env.VITE_API_URL;

const ContactManagement = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  // Fetch contact queries
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.get(`${API_URL}/admin/contact-queries`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm || undefined
        }
      });

      if (response.data.success) {
        setQueries(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.get(`${API_URL}/admin/contact-statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Update query status
  const updateStatus = async (queryId, newStatus, adminNotes) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.put(
        `${API_URL}/admin/contact-queries/${queryId}/status`,
        { status: newStatus, admin_notes: adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchQueries();
        fetchStats();
        setShowModal(false);
        setSelectedQuery(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Delete query
  const deleteQuery = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.delete(`${API_URL}/admin/contact-queries/${queryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchQueries();
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete query');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQueries();
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchQueries();
    fetchStats();
  }, [currentPage, statusFilter]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && queries.length === 0) {
    return (
      <div className="contact-management-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="contact-management-container">
      <div className="contact-header">
        <h1>Contact Query Management</h1>
        <p>Manage and respond to customer inquiries</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Queries</h3>
          <p className="stat-number">{stats.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today</h3>
          <p className="stat-number">{stats.today || 0}</p>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <p className="stat-number">{stats.thisWeek || 0}</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-number">{stats.thisMonth || 0}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="status-filter">
          <select value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Queries Table */}
      <div className="queries-table-container">
        <table className="queries-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query.id}>
                <td>#{query.id}</td>
                <td>{query.name}</td>
                <td>{query.email}</td>
                <td>
                  <div className="subject-cell">
                    <span className="subject-text">{query.subject}</span>
                    {query.message && query.message.length > 50 && (
                      <span className="message-preview">
                        {query.message.substring(0, 50)}...
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(query.status)}`}>
                    {getStatusText(query.status)}
                  </span>
                </td>
                <td>{new Date(query.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedQuery(query);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteQuery(query.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Query Detail Modal */}
      {showModal && selectedQuery && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Query Details #{selectedQuery.id}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="query-details">
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedQuery.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedQuery.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{selectedQuery.phone}</span>
              </div>
              <div className="detail-row">
                <label>Subject:</label>
                <span>{selectedQuery.subject}</span>
              </div>
              <div className="detail-row">
                <label>Message:</label>
                <div className="message-content">{selectedQuery.message}</div>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${getStatusBadgeClass(selectedQuery.status)}`}>
                  {getStatusText(selectedQuery.status)}
                </span>
              </div>
              <div className="detail-row">
                <label>Created:</label>
                <span>{new Date(selectedQuery.created_at).toLocaleString()}</span>
              </div>
              {selectedQuery.admin_notes && (
                <div className="detail-row">
                  <label>Admin Notes:</label>
                  <span>{selectedQuery.admin_notes}</span>
                </div>
              )}
              {selectedQuery.resolved_by && (
                <div className="detail-row">
                  <label>Resolved By:</label>
                  <span>{selectedQuery.admin_name}</span>
                </div>
              )}
            </div>

            <div className="status-update-section">
              <h3>Update Status</h3>
              <div className="status-update-form">
                <select
                  id="newStatus"
                  defaultValue={selectedQuery.status}
                  onChange={(e) => setSelectedQuery({ ...selectedQuery, newStatus: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <textarea
                  placeholder="Add admin notes (optional)"
                  value={selectedQuery.adminNotes || ''}
                  onChange={(e) => setSelectedQuery({ ...selectedQuery, adminNotes: e.target.value })}
                  rows="3"
                />
                <button
                  className="btn-update"
                  onClick={() => updateStatus(
                    selectedQuery.id,
                    selectedQuery.newStatus || selectedQuery.status,
                    selectedQuery.adminNotes
                  )}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ContactManagement;
