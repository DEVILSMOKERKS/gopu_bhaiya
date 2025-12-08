'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterManagement.css';

const NewsletterSend = () => {
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        recipientType: 'all', // 'all', 'selected'
        selectedEmails: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [subscribers, setSubscribers] = useState([]);
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/newsletter/subscribers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSubscribers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubscriberSelect = (subscriberId) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject || !formData.content) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.recipientType === 'selected' && selectedSubscribers.length === 0) {
            setError('Please select at least one subscriber');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.post(`${API_URL}/newsletter/send`, {
                subject: formData.subject,
                content: formData.content,
                recipientType: formData.recipientType,
                selectedEmails: formData.recipientType === 'selected' ? selectedSubscribers : []
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSuccess(`Email sent successfully to ${response.data.sentCount} subscribers`);
                setFormData({
                    subject: '',
                    content: '',
                    recipientType: 'all',
                    selectedEmails: []
                });
                setSelectedSubscribers([]);
            }
        } catch (error) {
            console.error('Error sending newsletter:', error);
            setError(error.response?.data?.message || 'Failed to send newsletter');
        } finally {
            setLoading(false);
        }
    };

    const getSelectedEmails = () => {
        return subscribers.filter(sub => selectedSubscribers.includes(sub.id));
    };

    return (
        <div className="newsletter-management">
            <div className="newsletter-management-header">
                <h1>Send Newsletter</h1>
                <div className="newsletter-management-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPreviewMode(!previewMode)}
                    >
                        {previewMode ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <div className="newsletter-send-container">
                <div className="newsletter-form-section">
                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <div className="form-group">
                            <label htmlFor="subject">Subject *</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Enter email subject"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content *</label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className="form-textarea"
                                placeholder="Enter email content (HTML supported)"
                                rows="10"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="recipientType">Recipients</label>
                            <select
                                id="recipientType"
                                name="recipientType"
                                value={formData.recipientType}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="all">All Subscribers ({subscribers.length})</option>
                                <option value="selected">Selected Subscribers</option>
                            </select>
                        </div>

                        {formData.recipientType === 'selected' && (
                            <div className="form-group">
                                <label>Select Subscribers</label>
                                <div className="subscriber-selection">
                                    <div className="selection-header">
                                        <input
                                            type="checkbox"
                                            checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                        <span>Select All ({selectedSubscribers.length} selected)</span>
                                    </div>
                                    <div className="subscriber-list">
                                        {subscribers.map((subscriber) => (
                                            <div key={subscriber.id} className="subscriber-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubscribers.includes(subscriber.id)}
                                                    onChange={() => handleSubscriberSelect(subscriber.id)}
                                                />
                                                <span>{subscriber.email}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Newsletter'}
                            </button>
                        </div>
                    </form>
                </div>

                {previewMode && (
                    <div className="newsletter-preview-section">
                        <h3>Email Preview</h3>
                        <div className="email-preview">
                            <div className="email-header">
                                <strong>Subject:</strong> {formData.subject || 'No subject'}
                            </div>
                            <div className="email-content">
                                <div dangerouslySetInnerHTML={{ __html: formData.content || 'No content' }} />
                            </div>
                            <div className="email-footer">
                                <strong>Recipients:</strong> {
                                    formData.recipientType === 'all'
                                        ? `All subscribers (${subscribers.length})`
                                        : `Selected subscribers (${selectedSubscribers.length})`
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterSend;
