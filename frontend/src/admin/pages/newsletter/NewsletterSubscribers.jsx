import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterManagement.css';

const NewsletterSubscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchSubscribers();
    }, [currentPage, searchTerm]);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/newsletter/subscribers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm
                }
            });

            if (response.data.success) {
                setSubscribers(response.data.data);
                setTotalPages(Math.ceil(response.data.count / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            setError('Failed to fetch subscribers');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSelectSubscriber = (subscriberId) => {
        setSelectedSubscribers(prev =>
            prev.includes(subscriberId)
                ? prev.filter(id => id !== subscriberId)
                : [...prev, subscriberId]
        );
    };

    const handleSelectAll = () => {
        if (selectedSubscribers.length === subscribers.length) {
            setSelectedSubscribers([]);
        } else {
            setSelectedSubscribers(subscribers.map(sub => sub.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedSubscribers.length === 0) return;

        try {
            setDeleteLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

            for (const subscriberId of selectedSubscribers) {
                await axios.delete(`${API_URL}/newsletter/subscribers/${subscriberId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            setSelectedSubscribers([]);
            setShowDeleteModal(false);
            fetchSubscribers();
        } catch (error) {
            console.error('Error deleting subscribers:', error);
            setError('Failed to delete subscribers');
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Email', 'Consent', 'Subscribed Date'],
            ...subscribers.map(sub => [
                sub.email,
                sub.consent ? 'Yes' : 'No',
                formatDate(sub.subscribed_at)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="newsletter-subscribers">
                <div className="newsletter-subscribers-loading">
                    <p>Loading subscribers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="newsletter-management">
            <div className="newsletter-management-header">
                <h1>Newsletter Subscribers</h1>
                <div className="newsletter-management-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={exportToCSV}
                        disabled={subscribers.length === 0}
                    >
                        Export CSV
                    </button>
                    {selectedSubscribers.length > 0 && (
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete Selected ({selectedSubscribers.length})
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="newsletter-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
                <div className="subscriber-count">
                    Total: {subscribers.length} subscribers
                </div>
            </div>

            <div className="newsletter-table-container">
                <table className="newsletter-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Email</th>
                            <th>Consent</th>
                            <th>Subscribed Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubscribers.includes(subscriber.id)}
                                        onChange={() => handleSelectSubscriber(subscriber.id)}
                                    />
                                </td>
                                <td>{subscriber.email}</td>
                                <td>
                                    <span className={`consent-badge ${subscriber.consent ? 'consent-yes' : 'consent-no'}`}>
                                        {subscriber.consent ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td>{formatDate(subscriber.subscribed_at)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            setSelectedSubscribers([subscriber.id]);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {subscribers.length === 0 && (
                    <div className="no-data">
                        <p>No subscribers found</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete {selectedSubscribers.length} subscriber(s)?</p>
                            <p>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteSelected}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsletterSubscribers;
