'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaArrowLeft, FaSearch } from 'react-icons/fa';
import './ProductAttributes.css';

const ProductAttributes = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProductId) {
            fetchAttributes(selectedProductId);
        }
    }, [selectedProductId]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredProducts(
                products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/products?limit=1000`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(response.data.data);
                setFilteredProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttributes = async (productId) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            const response = await axios.get(`${API_URL}/product-attributes/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setAttributes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching attributes:', error);
            setAttributes([]);
        }
    };

    const handleProductSelect = (productId) => {
        setSelectedProductId(productId);
        setEditingId(null);
    };

    const handleAddAttribute = () => {
        setAttributes(prev => [...prev, {
            attribute_id: null,
            attribute_name: '',
            attribute_value: '',
            sort_order: prev.length
        }]);
        setEditingId('new');
    };

    const handleEditAttribute = (attributeId) => {
        setEditingId(attributeId);
    };

    const handleCancelEdit = () => {
        if (editingId === 'new') {
            setAttributes(prev => prev.slice(0, -1));
        }
        setEditingId(null);
    };

    const handleSaveAttribute = async (attribute, index) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

            if (attribute.attribute_id) {
                // Update existing
                await axios.put(
                    `${API_URL}/product-attributes/${attribute.attribute_id}`,
                    {
                        attribute_name: attribute.attribute_name,
                        attribute_value: attribute.attribute_value,
                        sort_order: attribute.sort_order
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create new
                await axios.post(
                    `${API_URL}/product-attributes`,
                    {
                        product_id: selectedProductId,
                        attribute_name: attribute.attribute_name,
                        attribute_value: attribute.attribute_value,
                        sort_order: attribute.sort_order
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            await fetchAttributes(selectedProductId);
            setEditingId(null);
        } catch (error) {
            console.error('Error saving attribute:', error);
            alert('Error saving attribute: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteAttribute = async (attributeId) => {
        if (!confirm('Are you sure you want to delete this attribute?')) return;

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            await axios.delete(`${API_URL}/product-attributes/${attributeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchAttributes(selectedProductId);
        } catch (error) {
            console.error('Error deleting attribute:', error);
            alert('Error deleting attribute: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleBulkSave = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
            await axios.post(
                `${API_URL}/product-attributes/bulk`,
                {
                    product_id: selectedProductId,
                    attributes: attributes.map((attr, index) => ({
                        attribute_name: attr.attribute_name,
                        attribute_value: attr.attribute_value,
                        sort_order: attr.sort_order || index
                    }))
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchAttributes(selectedProductId);
            setEditingId(null);
        } catch (error) {
            console.error('Error bulk saving attributes:', error);
            alert('Error saving attributes: ' + (error.response?.data?.message || error.message));
        }
    };

    const updateAttributeField = (index, field, value) => {
        setAttributes(prev => prev.map((attr, i) =>
            i === index ? { ...attr, [field]: value } : attr
        ));
    };

    const selectedProduct = products.find(p => p.product_id === selectedProductId);

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
                <h1>Product Attributes Management</h1>
            </div>

            <div className="productattributes-content">
                {/* Product Selection */}
                <div className="productattributes-product-section">
                    <h2>Select Product</h2>
                    <div className="productattributes-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="productattributes-product-list">
                        {filteredProducts.map(product => (
                            <div
                                key={product.product_id}
                                className={`productattributes-product-item ${selectedProductId === product.product_id ? 'active' : ''}`}
                                onClick={() => handleProductSelect(product.product_id)}
                            >
                                <div className="productattributes-product-info">
                                    <h3>{product.name}</h3>
                                    {product.sku && <p className="productattributes-sku">SKU: {product.sku}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attributes Management */}
                {selectedProductId && (
                    <div className="productattributes-attributes-section">
                        <div className="productattributes-attributes-header">
                            <h2>
                                Attributes for: {selectedProduct?.name}
                                {selectedProduct?.sku && <span className="productattributes-sku-badge">SKU: {selectedProduct.sku}</span>}
                            </h2>
                            <button
                                className="productattributes-add-btn"
                                onClick={handleAddAttribute}
                                disabled={editingId !== null}
                            >
                                <FaPlus /> Add Attribute
                            </button>
                        </div>

                        {attributes.length === 0 && editingId === null ? (
                            <div className="productattributes-empty">
                                <p>No attributes found. Click "Add Attribute" to create one.</p>
                            </div>
                        ) : (
                            <div className="productattributes-attributes-list">
                                {attributes.map((attribute, index) => (
                                    <div key={attribute.attribute_id || `new-${index}`} className="productattributes-attribute-item">
                                        {editingId === attribute.attribute_id || (editingId === 'new' && index === attributes.length - 1) ? (
                                            <div className="productattributes-attribute-edit">
                                                <div className="productattributes-attribute-edit-fields">
                                                    <div className="productattributes-form-group">
                                                        <label>Attribute Name</label>
                                                        <input
                                                            type="text"
                                                            value={attribute.attribute_name}
                                                            onChange={(e) => updateAttributeField(index, 'attribute_name', e.target.value)}
                                                            placeholder="e.g., Material, Finish, Style"
                                                        />
                                                    </div>
                                                    <div className="productattributes-form-group">
                                                        <label>Attribute Value</label>
                                                        <input
                                                            type="text"
                                                            value={attribute.attribute_value}
                                                            onChange={(e) => updateAttributeField(index, 'attribute_value', e.target.value)}
                                                            placeholder="e.g., White Marble, Polished, Traditional"
                                                        />
                                                    </div>
                                                    <div className="productattributes-form-group">
                                                        <label>Sort Order</label>
                                                        <input
                                                            type="number"
                                                            value={attribute.sort_order}
                                                            onChange={(e) => updateAttributeField(index, 'sort_order', parseInt(e.target.value) || 0)}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="productattributes-attribute-actions">
                                                    <button
                                                        className="productattributes-save-btn"
                                                        onClick={() => handleSaveAttribute(attribute, index)}
                                                    >
                                                        <FaSave /> Save
                                                    </button>
                                                    <button
                                                        className="productattributes-cancel-btn"
                                                        onClick={handleCancelEdit}
                                                    >
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="productattributes-attribute-view">
                                                <div className="productattributes-attribute-content">
                                                    <div className="productattributes-attribute-name">
                                                        <strong>{attribute.attribute_name}</strong>
                                                    </div>
                                                    <div className="productattributes-attribute-value">
                                                        {attribute.attribute_value}
                                                    </div>
                                                    <div className="productattributes-attribute-order">
                                                        Order: {attribute.sort_order}
                                                    </div>
                                                </div>
                                                <div className="productattributes-attribute-actions">
                                                    <button
                                                        className="productattributes-edit-btn"
                                                        onClick={() => handleEditAttribute(attribute.attribute_id)}
                                                        disabled={editingId !== null}
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button
                                                        className="productattributes-delete-btn"
                                                        onClick={() => handleDeleteAttribute(attribute.attribute_id)}
                                                        disabled={editingId !== null}
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductAttributes;

