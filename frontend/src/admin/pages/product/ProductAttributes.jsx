'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaArrowLeft, FaSearch } from 'react-icons/fa';
import './ProductAttributes.css';

const ProductAttributes = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [attributeNames, setAttributeNames] = useState([]);
    const [selectedAttributeName, setSelectedAttributeName] = useState('');
    const [attributeValues, setAttributeValues] = useState([]);
    const [editingValueId, setEditingValueId] = useState(null);
    const [newValue, setNewValue] = useState('');
    const [editingName, setEditingName] = useState(null);
    const [newAttributeName, setNewAttributeName] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchAttributeNames();
    }, []);

    useEffect(() => {
        if (selectedAttributeName) {
            fetchAttributeValues(selectedAttributeName);
        } else {
            setAttributeValues([]);
        }
    }, [selectedAttributeName]);

    const fetchAttributeNames = async () => {
        try {
            setLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/product-attributes/names`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setAttributeNames(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching attribute names:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttributeValues = async (attributeName) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/product-attributes/values/${encodeURIComponent(attributeName)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setAttributeValues(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching attribute values:', error);
            setAttributeValues([]);
        }
    };

    const handleAddAttributeName = async () => {
        if (!newAttributeName.trim()) {
            alert('Please enter an attribute name');
            return;
        }

        // Check if name already exists
        if (attributeNames.includes(newAttributeName.trim())) {
            alert('Attribute name already exists');
            return;
        }

        // Create a dummy product attribute to add the name (we'll use a test product or create a system way)
        // For now, we'll just add it to the list and it will appear when first used
        setAttributeNames(prev => [...prev, newAttributeName.trim()].sort());
        setNewAttributeName('');
        alert('Attribute name added. It will be available when you assign it to a product.');
    };

    const handleDeleteAttributeName = async (name) => {
        if (!confirm(`Are you sure you want to delete attribute "${name}"? This will remove it from all products.`)) return;

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            // We need to delete all attributes with this name
            // Since we don't have a direct endpoint, we'll need to get all products and delete
            // For now, show a message
            alert('To delete an attribute name, please delete all product attributes with this name first from individual products.');
        } catch (error) {
            console.error('Error deleting attribute name:', error);
        }
    };

    const handleAddValue = async () => {
        if (!selectedAttributeName || !newValue.trim()) {
            alert('Please select an attribute name and enter a value');
            return;
        }

        if (attributeValues.includes(newValue.trim())) {
            alert('This value already exists for this attribute');
            return;
        }

        // Add value to list (it will be saved when assigned to a product)
        setAttributeValues(prev => [...prev, newValue.trim()].sort());
        setNewValue('');
        alert('Value added. It will be available when you assign it to a product.');
    };

    const handleDeleteValue = (value) => {
        if (!confirm(`Are you sure you want to remove value "${value}"?`)) return;
        setAttributeValues(prev => prev.filter(v => v !== value));
    };

    const handleEditValue = (oldValue, newValueText) => {
        if (!newValueText.trim()) {
            alert('Value cannot be empty');
            return;
        }

        if (attributeValues.includes(newValueText.trim()) && newValueText.trim() !== oldValue) {
            alert('This value already exists');
            return;
        }

        setAttributeValues(prev => prev.map(v => v === oldValue ? newValueText.trim() : v).sort());
        setEditingValueId(null);
    };

    if (loading) {
        return <div className="productattributes-loading">Loading...</div>;
    }

    return (
        <div className="productattributes-container">
            <div className="productattributes-header">
                <button
                    className="productattributes-back-btn"
                    onClick={() => router.push('/admin/products')}
                >
                    <FaArrowLeft /> Back to Products
                </button>
                <h1>Attribute Management</h1>
                <p>Manage attribute names and their possible values</p>
            </div>

            <div className="productattributes-content">
                {/* Attribute Names Section */}
                <div className="productattributes-section">
                    <div className="productattributes-section-header">
                        <h2>Attribute Names</h2>
                        <div className="productattributes-add-name">
                            <input
                                type="text"
                                placeholder="Enter new attribute name (e.g., Material, Finish, Style)"
                                value={newAttributeName}
                                onChange={(e) => setNewAttributeName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddAttributeName()}
                            />
                            <button
                                className="productattributes-add-btn"
                                onClick={handleAddAttributeName}
                            >
                                <FaPlus /> Add Name
                            </button>
                        </div>
                    </div>

                    <div className="productattributes-names-list">
                        {attributeNames.length === 0 ? (
                            <div className="productattributes-empty">
                                <p>No attribute names found. Add one to get started.</p>
                            </div>
                        ) : (
                            attributeNames.map((name, index) => (
                                <div
                                    key={index}
                                    className={`productattributes-name-item ${selectedAttributeName === name ? 'active' : ''}`}
                                    onClick={() => setSelectedAttributeName(name)}
                                >
                                    <span className="productattributes-name-text">{name}</span>
                                    <button
                                        className="productattributes-delete-name-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAttributeName(name);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Attribute Values Section */}
                {selectedAttributeName && (
                    <div className="productattributes-section">
                        <div className="productattributes-section-header">
                            <h2>Values for: <span className="productattributes-selected-name">{selectedAttributeName}</span></h2>
                            <div className="productattributes-add-value">
                                <input
                                    type="text"
                                    placeholder="Enter new value"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                                />
                                <button
                                    className="productattributes-add-btn"
                                    onClick={handleAddValue}
                                >
                                    <FaPlus /> Add Value
                                </button>
                            </div>
                        </div>

                        <div className="productattributes-values-list">
                            {attributeValues.length === 0 ? (
                                <div className="productattributes-empty">
                                    <p>No values found for this attribute. Add one to get started.</p>
                                </div>
                            ) : (
                                attributeValues.map((value, index) => (
                                    <div key={index} className="productattributes-value-item">
                                        {editingValueId === index ? (
                                            <div className="productattributes-value-edit">
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => {
                                                        const newValues = [...attributeValues];
                                                        newValues[index] = e.target.value;
                                                        setAttributeValues(newValues);
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleEditValue(attributeValues[editingValueId], e.target.value);
                                                        } else if (e.key === 'Escape') {
                                                            setEditingValueId(null);
                                                            fetchAttributeValues(selectedAttributeName);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                                <button
                                                    className="productattributes-save-btn"
                                                    onClick={() => handleEditValue(attributeValues[editingValueId], attributeValues[editingValueId])}
                                                >
                                                    <FaSave />
                                                </button>
                                                <button
                                                    className="productattributes-cancel-btn"
                                                    onClick={() => {
                                                        setEditingValueId(null);
                                                        fetchAttributeValues(selectedAttributeName);
                                                    }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="productattributes-value-view">
                                                <span className="productattributes-value-text">{value}</span>
                                                <div className="productattributes-value-actions">
                                                    <button
                                                        className="productattributes-edit-btn"
                                                        onClick={() => setEditingValueId(index)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="productattributes-delete-btn"
                                                        onClick={() => handleDeleteValue(value)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {!selectedAttributeName && (
                    <div className="productattributes-section">
                        <div className="productattributes-empty-large">
                            <p>Select an attribute name from the left to manage its values</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductAttributes;
