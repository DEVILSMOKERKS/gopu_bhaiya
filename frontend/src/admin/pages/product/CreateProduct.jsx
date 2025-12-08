'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { FaPlus, FaTrash, FaUpload, FaSave, FaArrowLeft } from 'react-icons/fa';
import { validateProduct, validateImageUpload, showValidationErrors } from './validation';
import './CreateProduct.css';

const CreateProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    subcategory_id: '',
    description: '',
    fitting_info: '',
    fabric_info: '',
    care_info: '',
    product_detail: '',
    shipping_info: '',
    return_policy: '',
    status: 'active'
  });

  const [colors, setColors] = useState([
    { name: '', code: '#000000', images: [], previewUrls: [] }
  ]);

  const [sizes, setSizes] = useState([
    { size: 'S', actual_price: '', sell_price: '', offer_percent: 0, stock: 0 }
  ]);

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      fetchSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const data = response.data;
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/subcategories?category_id=${categoryId}`);
      const data = response.data;
      if (data.success) {
        setSubcategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorImageUpload = (colorIndex, e) => {
    const files = Array.from(e.target.files);
    const newImages = [...colors[colorIndex].images, ...files];
    const newPreviewUrls = [...colors[colorIndex].previewUrls];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewUrls.push(e.target.result);
        updateColor(colorIndex, 'previewUrls', newPreviewUrls);
      };
      reader.readAsDataURL(file);
    });

    updateColor(colorIndex, 'images', newImages);
  };

  const removeColorImage = (colorIndex, imageIndex) => {
    const newImages = colors[colorIndex].images.filter((_, i) => i !== imageIndex);
    const newPreviewUrls = colors[colorIndex].previewUrls.filter((_, i) => i !== imageIndex);

    updateColor(colorIndex, 'images', newImages);
    updateColor(colorIndex, 'previewUrls', newPreviewUrls);
  };

  const addColor = () => {
    setColors(prev => [...prev, { name: '', code: '#000000', images: [], previewUrls: [] }]);
  };

  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index, field, value) => {
    setColors(prev => prev.map((color, i) =>
      i === index ? { ...color, [field]: value } : color
    ));
  };

  const addSize = () => {
    setSizes(prev => [...prev, { size: '', actual_price: '', sell_price: '', offer_percent: 0, stock: 0 }]);
  };

  const removeSize = (index) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  };

  const updateSize = (index, field, value) => {
    setSizes(prev => prev.map((size, i) =>
      i === index ? { ...size, [field]: value } : color
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate product data
    const productValidation = validateProduct(formData, colors, sizes);
    const imageValidation = validateImageUpload(colors);

    if (!productValidation.isValid) {
      showValidationErrors(productValidation.errors);
      return;
    }

    if (!imageValidation.isValid) {
      showValidationErrors(imageValidation.errors);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add basic product info
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add all images from all colors
      let imageIndex = 0;
      const colorsWithImageIndices = colors.map(color => {
        const colorWithIndices = { ...color };
        colorWithIndices.images = [];

        color.images.forEach((file, fileIndex) => {
          formDataToSend.append('images', file);
          colorWithIndices.images.push(imageIndex);
          imageIndex++;
        });

        return colorWithIndices;
      });


      // Add colors with image indices
      formDataToSend.append('colors', JSON.stringify(colorsWithImageIndices));

      // Add sizes
      formDataToSend.append('sizes', JSON.stringify(sizes));

      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.post(`${API_URL}/products`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        alert('Product created successfully!');
        router.push('/admin/products');
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createproduct-container">
      <div className="createproduct-header">
        <button
          className="createproduct-back-btn"
          onClick={() => router.push('/admin/products')}
        >
          <FaArrowLeft /> Back to Products
        </button>
        <h1>Create New Product</h1>
        <p>Add a new product to your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="createproduct-form">
        <div className="createproduct-form-sections">
          {/* Basic Information */}
          <div className="createproduct-form-section">
            <h2>Basic Information</h2>
            <div className="createproduct-form-grid">
              <div className="createproduct-form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="createproduct-form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="createproduct-form-group">
                <label>Subcategory</label>
                <select
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleInputChange}
                  disabled={!formData.category_id}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="createproduct-form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="createproduct-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="4"
              />
            </div>
          </div>

          {/* Colors & Images */}
          <div className="createproduct-form-section">
            <h2>Colors & Images</h2>
            {colors.map((color, colorIndex) => (
              <div key={colorIndex} className="createproduct-color-item">
                <div className="createproduct-color-header">
                  <h3>Color {colorIndex + 1}</h3>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      className="createproduct-remove-btn"
                      onClick={() => removeColor(colorIndex)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="createproduct-color-inputs">
                  <div className="createproduct-form-group">
                    <label>Color Name</label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(colorIndex, 'name', e.target.value)}
                      placeholder="e.g., Red, Blue, Green"
                    />
                  </div>
                  <div className="createproduct-form-group">
                    <label>Color Code</label>
                    <input
                      type="color"
                      value={color.code}
                      onChange={(e) => updateColor(colorIndex, 'code', e.target.value)}
                    />
                  </div>
                </div>

                {/* Color-specific image upload */}
                <div className="createproduct-color-images-section">
                  <h4>Images for {color.name || `Color ${colorIndex + 1}`}</h4>
                  <div className="createproduct-image-upload-section">
                    <div className="createproduct-file-upload-area">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleColorImageUpload(colorIndex, e)}
                        id={`image-upload-${colorIndex}`}
                        className="createproduct-file-input"
                      />
                      <label htmlFor={`image-upload-${colorIndex}`} className="createproduct-upload-label">
                        <FaUpload />
                        <span>Click to upload images for this color</span>
                        <small>You can select multiple images (max 5 per color)</small>
                      </label>
                    </div>

                    {color.previewUrls && color.previewUrls.length > 0 && (
                      <div className="createproduct-image-previews">
                        <h5>Selected Images ({color.previewUrls.length})</h5>
                        <div className="createproduct-preview-grid">
                          {color.previewUrls.map((url, imageIndex) => (
                            <div key={imageIndex} className="createproduct-image-preview">
                              <Image src={url} alt={`Preview ${imageIndex + 1}`} width={150} height={150} style={{ objectFit: 'cover' }} />
                              <button
                                type="button"
                                className="createproduct-remove-image-btn"
                                onClick={() => removeColorImage(colorIndex, imageIndex)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="createproduct-add-btn"
              onClick={addColor}
            >
              <FaPlus /> Add Color
            </button>
          </div>

          {/* Sizes & Pricing */}
          <div className="createproduct-form-section">
            <h2>Sizes & Pricing</h2>
            {sizes.map((size, sizeIndex) => (
              <div key={sizeIndex} className="createproduct-size-item">
                <div className="createproduct-size-header">
                  <h3>Size {sizeIndex + 1}</h3>
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      className="createproduct-remove-btn"
                      onClick={() => removeSize(sizeIndex)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="createproduct-size-inputs">
                  <div className="createproduct-form-group">
                    <label>Size</label>
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) => updateSize(sizeIndex, 'size', e.target.value)}
                      placeholder="e.g., S, M, L, XL"
                    />
                  </div>
                  <div className="createproduct-form-group">
                    <label>Actual Price (₹)</label>
                    <input
                      type="number"
                      value={size.actual_price}
                      onChange={(e) => updateSize(sizeIndex, 'actual_price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="createproduct-form-group">
                    <label>Selling Price (₹)</label>
                    <input
                      type="number"
                      value={size.sell_price}
                      onChange={(e) => updateSize(sizeIndex, 'sell_price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="createproduct-form-group">
                    <label>Offer %</label>
                    <input
                      type="number"
                      value={size.offer_percent}
                      onChange={(e) => updateSize(sizeIndex, 'offer_percent', e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="createproduct-form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={size.stock}
                      onChange={(e) => updateSize(sizeIndex, 'stock', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="createproduct-add-btn"
              onClick={addSize}
            >
              <FaPlus /> Add Size
            </button>
          </div>

          {/* Additional Information */}
          <div className="createproduct-form-section">
            <h2>Additional Information</h2>
            <div className="createproduct-form-grid">
              <div className="createproduct-form-group">
                <label>Fitting Information</label>
                <textarea
                  name="fitting_info"
                  value={formData.fitting_info}
                  onChange={handleInputChange}
                  placeholder="Fitting details..."
                  rows="3"
                />
              </div>
              <div className="createproduct-form-group">
                <label>Fabric Information</label>
                <textarea
                  name="fabric_info"
                  value={formData.fabric_info}
                  onChange={handleInputChange}
                  placeholder="Fabric details..."
                  rows="3"
                />
              </div>
              <div className="createproduct-form-group">
                <label>Care Instructions</label>
                <textarea
                  name="care_info"
                  value={formData.care_info}
                  onChange={handleInputChange}
                  placeholder="Care instructions..."
                  rows="3"
                />
              </div>
              <div className="createproduct-form-group">
                <label>Product Details</label>
                <textarea
                  name="product_detail"
                  value={formData.product_detail}
                  onChange={handleInputChange}
                  placeholder="Detailed product information..."
                  rows="3"
                />
              </div>
              <div className="createproduct-form-group">
                <label>Shipping Information</label>
                <textarea
                  name="shipping_info"
                  value={formData.shipping_info}
                  onChange={handleInputChange}
                  placeholder="Shipping details..."
                  rows="3"
                />
              </div>
              <div className="createproduct-form-group">
                <label>Return Policy</label>
                <textarea
                  name="return_policy"
                  value={formData.return_policy}
                  onChange={handleInputChange}
                  placeholder="Return policy details..."
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="createproduct-form-actions">
          <button
            type="button"
            className="createproduct-cancel-btn"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="createproduct-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="createproduct-spinner"></div>
                Creating...
              </>
            ) : (
              <>
                <FaSave />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
