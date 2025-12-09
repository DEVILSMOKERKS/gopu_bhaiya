'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpertConsultationManagement.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ExpertConsultationManagement = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({});

    // Fetch expert consultations
    const fetchConsultations = async () => {
        try {
            setLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/admin/expert-consultations`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage,
                    limit: 10,
                    status: statusFilter === 'all' ? undefined : statusFilter,
                    search: searchTerm || undefined
                }
            });

            if (response.data.success) {
                setConsultations(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch consultations');
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/admin/expert-consultation-statistics`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    // Update consultation status
    const updateStatus = async (consultationId, newStatus, adminNotes) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.put(
                `${API_URL}/admin/expert-consultations/${consultationId}/status`,
                { status: newStatus, admin_notes: adminNotes },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                fetchConsultations();
                fetchStats();
                setShowModal(false);
                setSelectedConsultation(null);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    // Delete consultation
    const deleteConsultation = async (consultationId) => {
        if (!window.confirm('Are you sure you want to delete this consultation request?')) return;

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.delete(`${API_URL}/admin/expert-consultations/${consultationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                fetchConsultations();
                fetchStats();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete consultation');
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchConsultations();
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
        fetchConsultations();
        fetchStats();
    }, [currentPage, statusFilter]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'contacted': return 'status-contacted';
            case 'in_progress': return 'status-progress';
            case 'completed': return 'status-completed';
            case 'closed': return 'status-closed';
            default: return 'status-pending';
        }
    };

    const getStatusText = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getAboutYourselfText = (type) => {
        if (type === 'homeowner') {
            return 'Homeowner';
        } else if (type === 'designer') {
            return 'Interior Designer/Consultant';
        }
        return type;
    };

    if (loading && consultations.length === 0) {
        return (
            <div className="expert-consultation-management-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="expert-consultation-management-container">
            <div className="consultation-header">
                <h1>Expert Consultation Management</h1>
                <p>Manage and respond to expert consultation requests</p>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Requests</h3>
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

            {/* Type Statistics */}
            {stats.byType && (
                <div className="type-stats">
                    <div className="type-stat-card">
                        <h4>Homeowners</h4>
                        <p>{stats.byType.homeowner || 0}</p>
                    </div>
                    <div className="type-stat-card">
                        <h4>Designers/Consultants</h4>
                        <p>{stats.byType.designer || 0}</p>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="filters-section">
                <div className="search-box">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search by name, email, city, or phone..."
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
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Consultations Table */}
            <div className="consultations-table-container">
                <table className="consultations-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultations.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="no-data">
                                    No consultation requests found
                                </td>
                            </tr>
                        ) : (
                            consultations.map((consultation) => (
                                <tr key={consultation.id}>
                                    <td>#{consultation.id}</td>
                                    <td>{consultation.full_name}</td>
                                    <td>{consultation.email}</td>
                                    <td>{consultation.phone || 'N/A'}</td>
                                    <td>{consultation.city}</td>
                                    <td>
                                        <span className="type-badge">
                                            {getAboutYourselfText(consultation.about_yourself)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(consultation.status)}`}>
                                            {getStatusText(consultation.status)}
                                        </span>
                                    </td>
                                    <td>{new Date(consultation.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-view"
                                                onClick={() => {
                                                    setSelectedConsultation(consultation);
                                                    setShowModal(true);
                                                }}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteConsultation(consultation.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
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

            {/* Consultation Detail Modal */}
            {showModal && selectedConsultation && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Consultation Details #{selectedConsultation.id}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="consultation-details">
                            <div className="detail-row">
                                <label>Full Name:</label>
                                <span>{selectedConsultation.full_name}</span>
                            </div>
                            <div className="detail-row">
                                <label>Email:</label>
                                <span>{selectedConsultation.email}</span>
                            </div>
                            <div className="detail-row">
                                <label>Phone:</label>
                                <span>{selectedConsultation.phone || 'Not provided'}</span>
                            </div>
                            <div className="detail-row">
                                <label>City:</label>
                                <span>{selectedConsultation.city}</span>
                            </div>
                            <div className="detail-row">
                                <label>Type:</label>
                                <span className="type-badge">
                                    {getAboutYourselfText(selectedConsultation.about_yourself)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <label>Status:</label>
                                <span className={`status-badge ${getStatusBadgeClass(selectedConsultation.status)}`}>
                                    {getStatusText(selectedConsultation.status)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <label>Created:</label>
                                <span>{new Date(selectedConsultation.created_at).toLocaleString()}</span>
                            </div>
                            {selectedConsultation.contacted_at && (
                                <div className="detail-row">
                                    <label>Contacted At:</label>
                                    <span>{new Date(selectedConsultation.contacted_at).toLocaleString()}</span>
                                </div>
                            )}
                            {selectedConsultation.admin_notes && (
                                <div className="detail-row">
                                    <label>Admin Notes:</label>
                                    <div className="notes-content">{selectedConsultation.admin_notes}</div>
                                </div>
                            )}
                            {selectedConsultation.contacted_by && (
                                <div className="detail-row">
                                    <label>Contacted By:</label>
                                    <span>{selectedConsultation.admin_name}</span>
                                </div>
                            )}
                        </div>

                        <div className="status-update-section">
                            <h3>Update Status</h3>
                            <div className="status-update-form">
                                <select
                                    id="newStatus"
                                    defaultValue={selectedConsultation.status}
                                    onChange={(e) => setSelectedConsultation({ ...selectedConsultation, newStatus: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <textarea
                                    placeholder="Add admin notes (optional)"
                                    value={selectedConsultation.adminNotes || ''}
                                    onChange={(e) => setSelectedConsultation({ ...selectedConsultation, adminNotes: e.target.value })}
                                    rows="3"
                                />
                                <button
                                    className="btn-update"
                                    onClick={() => updateStatus(
                                        selectedConsultation.id,
                                        selectedConsultation.newStatus || selectedConsultation.status,
                                        selectedConsultation.adminNotes
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

export default ExpertConsultationManagement;

