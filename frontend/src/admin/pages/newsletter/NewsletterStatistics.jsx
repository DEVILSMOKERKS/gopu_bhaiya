import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterManagement.css';

const NewsletterStatistics = () => {
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        newThisMonth: 0,
        newThisWeek: 0,
        newToday: 0,
        consentRate: 0,
        monthlyGrowth: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/newsletter/statistics`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError('Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="newsletter-statistics">
                <div className="newsletter-statistics-loading">
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="newsletter-management">
            <div className="newsletter-management-header">
                <h1>Newsletter Statistics</h1>
                <div className="newsletter-management-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchStatistics}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="statistics-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Total Subscribers</h3>
                        <p className="stat-number">{stats.totalSubscribers}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>New This Month</h3>
                        <p className="stat-number">{stats.newThisMonth}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>New This Week</h3>
                        <p className="stat-number">{stats.newThisWeek}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>New Today</h3>
                        <p className="stat-number">{stats.newToday}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                            <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                            <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                            <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>Consent Rate</h3>
                        <p className="stat-number">{stats.consentRate}%</p>
                    </div>
                </div>
            </div>

            <div className="statistics-chart">
                <h3>Monthly Growth</h3>
                <div className="chart-container">
                    {stats.monthlyGrowth.length > 0 ? (
                        <div className="growth-chart">
                            {stats.monthlyGrowth.map((month, index) => (
                                <div key={index} className="chart-bar">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            height: `${(month.count / Math.max(...stats.monthlyGrowth.map(m => m.count))) * 100}%`
                                        }}
                                    ></div>
                                    <span className="bar-label">{month.month}</span>
                                    <span className="bar-value">{month.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No growth data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsletterStatistics;
