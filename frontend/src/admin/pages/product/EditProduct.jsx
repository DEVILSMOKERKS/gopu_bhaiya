'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { FaPlus, FaTrash, FaUpload, FaSave, FaArrowLeft } from 'react-icons/fa';
import { validateProduct, validateImageUpload, showValidationErrors } from './validation';
import './EditProduct.css';

const EditProduct = ({ productId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    subcategory_id: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    featured_image: '',
    video_url: '',
    tags: '',
    is_featured: false,
    is_new: false,
    is_bestseller: false,
    is_customizable: false,
    min_order_quantity: 1,
    lead_time_days: '',
    description: '',
    product_detail: '',
    shipping_info: '',
    return_policy: '',
    status: 'active'
  });

  const [colors, setColors] = useState([
    { name: '', code: '#000000', images: [], previewUrls: [], existingImages: [] }
  ]);

  const [sizes, setSizes] = useState([
    { size: 'Standard', actual_price: '', sell_price: '', offer_percent: 0, stock: 0, height: '', width: '', depth: '', weight: '', dimensions_unit: 'cm', weight_unit: 'kg' }
  ]);

  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [availableAttributeNames, setAvailableAttributeNames] = useState([]);
  const [attributeValuesMap, setAttributeValuesMap] = useState({});

  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchCategories();
    fetchAttributeNames();
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (availableAttributeNames.length > 0) {
      fetchAllAttributeValues();
    }
  }, [availableAttributeNames]);

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

  const fetchAttributeNames = async () => {
    try {
      const response = await axios.get(`${API_URL}/product-attributes/names`);
      if (response.data.success) {
        setAvailableAttributeNames(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching attribute names:', error);
    }
  };

  const fetchAttributeValues = async (attributeName) => {
    try {
      const response = await axios.get(`${API_URL}/product-attributes/values/${encodeURIComponent(attributeName)}`);
      if (response.data.success) {
        setAttributeValuesMap(prev => ({
          ...prev,
          [attributeName]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching attribute values:', error);
    }
  };

  const fetchAllAttributeValues = async () => {
    for (const name of availableAttributeNames) {
      await fetchAttributeValues(name);
    }
  };

  const addAttribute = () => {
    setSelectedAttributes(prev => [...prev, { name: '', value: '' }]);
  };

  const removeAttribute = (index) => {
    setSelectedAttributes(prev => prev.filter((_, i) => i !== index));
  };

  const updateAttribute = (index, field, value) => {
    setSelectedAttributes(prev => prev.map((attr, i) => {
      if (i === index) {
        const updated = { ...attr, [field]: value };
        // If name changed, reset value
        if (field === 'name') {
          updated.value = '';
        }
        return updated;
      }
      return attr;
    }));
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      const data = response.data;

      if (data.success) {
        const product = data.data;

        // Set basic form data
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          category_id: product.category_id || '',
          subcategory_id: product.subcategory_id || '',
          slug: product.slug || '',
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
          featured_image: product.featured_image || '',
          video_url: product.video_url || '',
          tags: product.tags || '',
          is_featured: product.is_featured || false,
          is_new: product.is_new || false,
          is_bestseller: product.is_bestseller || false,
          is_customizable: product.is_customizable || false,
          min_order_quantity: product.min_order_quantity || 1,
          lead_time_days: product.lead_time_days || '',
          description: product.description || '',
          product_detail: product.product_detail || '',
          shipping_info: product.shipping_info || '',
          return_policy: product.return_policy || '',
          status: product.status || 'active'
        });

        // Set colors with existing images
        if (product.colors && product.colors.length > 0) {
          setColors(product.colors.map(color => ({
            name: color.color_name || '',
            code: color.color_code || '#000000',
            images: [], // New uploaded images (Files)
            previewUrls: [], // Preview URLs for new images
            existingImages: (color.images || []).map((img) =>
              (typeof img === 'string' ? img : (img?.url || img?.image_url || ''))
            ).filter(Boolean)
          })));

          // Set existing image previews for colors
          setTimeout(() => {
            setColors(prevColors => prevColors.map((color, index) => {
              const productColor = product.colors[index];
              const existingImages = (productColor?.images || []).map((img) =>
                (typeof img === 'string' ? img : (img?.url || img?.image_url || ''))
              ).filter(Boolean);
              if (productColor && existingImages.length > 0) {
                return {
                  ...color,
                  existingImages,
                  previewUrls: existingImages.map(img => `${API_URL.replace('/api', '')}${img.startsWith('/') ? '' : '/'}${img}`)
                };
              }
              return color;
            }));
          }, 100);
        }

        // Set sizes
        if (product.sizes && product.sizes.length > 0) {
          setSizes(product.sizes.map(size => ({
            size: size.size || 'Standard',
            height: size.height || '',
            width: size.width || '',
            depth: size.depth || '',
            weight: size.weight || '',
            dimensions_unit: size.dimensions_unit || 'cm',
            weight_unit: size.weight_unit || 'kg',
            actual_price: size.actual_price || '',
            sell_price: size.sell_price || '',
            offer_percent: size.offer_percent || 0,
            stock: size.stock || 0
          })));
        }

        // Set attributes
        if (product.attributes && product.attributes.length > 0) {
          setSelectedAttributes(product.attributes.map(attr => ({
            name: attr.attribute_name || '',
            value: attr.attribute_value || ''
          })));
        } else {
          setSelectedAttributes([]);
        }

      } else {
        alert('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
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

  const removeColorImage = (colorIndex, imageIndex, isExisting = false) => {
    if (isExisting) {
      // Remove existing image
      const newExistingImages = colors[colorIndex].existingImages.filter((_, i) => i !== imageIndex);
      const newPreviewUrls = colors[colorIndex].previewUrls.filter((_, i) => i !== imageIndex);

      updateColor(colorIndex, 'existingImages', newExistingImages);
      updateColor(colorIndex, 'previewUrls', newPreviewUrls);
    } else {
      // Remove new uploaded image
      const newImages = colors[colorIndex].images.filter((_, i) => i !== imageIndex);
      const newPreviewUrls = colors[colorIndex].previewUrls.filter((_, i) => i !== imageIndex);

      updateColor(colorIndex, 'images', newImages);
      updateColor(colorIndex, 'previewUrls', newPreviewUrls);
    }
  };

  const addColor = () => {
    setColors(prev => [...prev, { name: '', code: '#000000', images: [], previewUrls: [], existingImages: [] }]);
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
      i === index ? { ...size, [field]: value } : size
    ));
  };


  // Custom validation for edit mode that only validates new uploaded images
  const validateImageUploadForEdit = (colors) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!colors || colors.length === 0) {
      errors.push('At least one color is required');
      return { isValid: false, errors };
    }

    let totalNewImages = 0;
    let totalExistingImages = 0;

    colors.forEach((color, colorIndex) => {
      // Count existing images
      if (color.existingImages && color.existingImages.length > 0) {
        totalExistingImages += color.existingImages.length;
      }

      // Validate new uploaded images
      if (color.images && color.images.length > 0) {
        totalNewImages += color.images.length;

        color.images.forEach((file, fileIndex) => {
          if (file.size > maxSize) {
            errors.push(`Color ${colorIndex + 1} - Image ${fileIndex + 1} size must be less than 5MB`);
          }
          if (!allowedTypes.includes(file.type)) {
            errors.push(`Color ${colorIndex + 1} - Image ${fileIndex + 1} must be JPEG, PNG, or WebP format`);
          }
        });
      }
    });

    const totalImages = totalNewImages + totalExistingImages;
    if (totalImages > 20) {
      errors.push('Maximum 20 total images allowed across all colors');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Custom product validation for edit mode
  const validateProductForEdit = (formData, colors, sizes) => {
    const errors = [];

    // Basic validation
    if (!formData.name || formData.name.trim() === '') {
      errors.push('Product name is required');
    }

    // Color validation - check if each color has at least one image (existing or new)
    if (!colors || colors.length === 0) {
      errors.push('At least one color is required');
    } else {
      colors.forEach((color, index) => {
        if (!color.name || color.name.trim() === '') {
          errors.push(`Color ${index + 1} name is required`);
        }

        const totalImages = (color.existingImages ? color.existingImages.length : 0) +
          (color.images ? color.images.length : 0);
        if (totalImages === 0) {
          errors.push(`Color ${index + 1} must have at least one image`);
        }
      });
    }

    // Size validation
    if (!sizes || sizes.length === 0) {
      errors.push('At least one size is required');
    } else {
      sizes.forEach((size, index) => {
        if (!size.size || size.size.trim() === '') {
          errors.push(`Size ${index + 1} is required`);
        }
        if (!size.actual_price || size.actual_price <= 0) {
          errors.push(`Size ${index + 1} actual price must be greater than 0`);
        }
        if (!size.sell_price || size.sell_price <= 0) {
          errors.push(`Size ${index + 1} selling price must be greater than 0`);
        }
        if (size.sell_price > size.actual_price) {
          errors.push(`Size ${index + 1} selling price cannot be greater than actual price`);
        }
        if (size.stock < 0) {
          errors.push(`Size ${index + 1} stock cannot be negative`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate product data
    const productValidation = validateProductForEdit(formData, colors, sizes);
    const imageValidation = validateImageUploadForEdit(colors);

    if (!productValidation.isValid) {
      showValidationErrors(productValidation.errors);
      return;
    }

    if (!imageValidation.isValid) {
      showValidationErrors(imageValidation.errors);
      return;
    }

    setSaving(true);

    try {
      const formDataToSend = new FormData();

      // Add basic product info
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add all new images from all colors
      let imageIndex = 0;
      const colorsWithImageIndices = colors.map(color => {
        const colorWithIndices = {
          name: color.name,
          code: color.code,
          images: [],
          existingImages: color.existingImages || []
        };

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

      const attributesToSend = selectedAttributes.filter(attr => attr.name && attr.value);
      formDataToSend.append('attributes', JSON.stringify(attributesToSend));

      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await axios.put(`${API_URL}/products/${productId}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;

      if (data.success) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editproduct-container">
        <div className="editproduct-loading">
          <div className="editproduct-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editproduct-container">
      <div className="editproduct-header">
        <button
          className="editproduct-back-btn"
          onClick={() => router.push('/admin/products')}
        >
          <FaArrowLeft /> Back to Products
        </button>
        <h1>Edit Product</h1>
        <p>Update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="editproduct-form">
        <div className="editproduct-form-sections">
          {/* Basic Information */}
          <div className="editproduct-form-section">
            <h2>Basic Information</h2>
            <div className="editproduct-form-grid">
              <div className="editproduct-form-group">
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

              <div className="editproduct-form-group">
                <label>SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Product SKU/Code"
                />
              </div>

              <div className="editproduct-form-group">
                <label>Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="product-url-slug"
                />
              </div>

              <div className="editproduct-form-group">
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

              <div className="editproduct-form-group">
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

              <div className="editproduct-form-group">
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

            <div className="editproduct-form-group">
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

          {/* SEO & Marketing */}
          <div className="editproduct-form-section">
            <h2>SEO & Marketing</h2>
            <div className="editproduct-form-grid">
              <div className="editproduct-form-group">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO meta title"
                />
              </div>

              <div className="editproduct-form-group">
                <label>Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows="2"
                />
              </div>

              <div className="editproduct-form-group">
                <label>Featured Image URL</label>
                <input
                  type="text"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div className="editproduct-form-group">
                <label>Video URL</label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="editproduct-form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="marble, statue, temple"
                />
              </div>
            </div>

            <div className="editproduct-form-grid">
              <div className="editproduct-form-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  />
                  Featured Product
                </label>
              </div>

              <div className="editproduct-form-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={formData.is_new}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_new: e.target.checked }))}
                  />
                  New Product
                </label>
              </div>

              <div className="editproduct-form-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_bestseller"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                  />
                  Bestseller
                </label>
              </div>

              <div className="editproduct-form-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_customizable"
                    checked={formData.is_customizable}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_customizable: e.target.checked }))}
                  />
                  Customizable
                </label>
              </div>
            </div>

            <div className="editproduct-form-grid">
              <div className="editproduct-form-group">
                <label>Min Order Quantity</label>
                <input
                  type="number"
                  name="min_order_quantity"
                  value={formData.min_order_quantity}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>

              <div className="editproduct-form-group">
                <label>Lead Time (Days)</label>
                <input
                  type="number"
                  name="lead_time_days"
                  value={formData.lead_time_days}
                  onChange={handleInputChange}
                  placeholder="7-15"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Colors & Images */}
          <div className="editproduct-form-section">
            <h2>Colors & Images</h2>
            {colors.map((color, colorIndex) => (
              <div key={colorIndex} className="editproduct-color-item">
                <div className="editproduct-color-header">
                  <h3>Color {colorIndex + 1}</h3>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      className="editproduct-remove-btn"
                      onClick={() => removeColor(colorIndex)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="editproduct-color-inputs">
                  <div className="editproduct-form-group">
                    <label>Color Name</label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(colorIndex, 'name', e.target.value)}
                      placeholder="e.g., Red, Blue, Green"
                    />
                  </div>
                  <div className="editproduct-form-group">
                    <label>Color Code</label>
                    <input
                      type="color"
                      value={color.code}
                      onChange={(e) => updateColor(colorIndex, 'code', e.target.value)}
                    />
                  </div>
                </div>

                {/* Color-specific image upload */}
                <div className="editproduct-color-images-section">
                  <h4>Images for {color.name || `Color ${colorIndex + 1}`}</h4>
                  <div className="editproduct-image-upload-section">
                    <div className="editproduct-file-upload-area">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleColorImageUpload(colorIndex, e)}
                        id={`image-upload-${colorIndex}`}
                        className="editproduct-file-input"
                      />
                      <label htmlFor={`image-upload-${colorIndex}`} className="editproduct-upload-label">
                        <FaUpload />
                        <span>Click to upload images for this color</span>
                        <small>You can select multiple images (max 5 per color)</small>
                      </label>
                    </div>

                    {/* Existing Images */}
                    {color.existingImages && color.existingImages.length > 0 && (
                      <div className="editproduct-image-previews">
                        <h5>Existing Images ({color.existingImages.length})</h5>
                        <div className="editproduct-preview-grid">
                          {color.existingImages.map((imageUrl, imageIndex) => {
                            const raw = typeof imageUrl === 'string' ? imageUrl : (imageUrl?.url ?? imageUrl?.image_url ?? '');
                            const src = raw ? `${API_URL.replace('/api', '')}${raw.startsWith('/') ? '' : '/'}${raw}` : '';
                            if (!src) return null;
                            return (
                            <div key={`existing-${imageIndex}`} className="editproduct-image-preview">
                              <Image
                                src={src}
                                alt={`Existing ${imageIndex + 1}`}
                                width={150}
                                height={150}
                                style={{ objectFit: 'cover', width: '100%', height: '150px' }}
                              />
                              <button
                                type="button"
                                className="editproduct-remove-image-btn"
                                onClick={() => removeColorImage(colorIndex, imageIndex, true)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          );
                          })}
                        </div>
                      </div>
                    )}

                    {/* New Uploaded Images */}
                    {color.previewUrls && color.previewUrls.length > 0 && (
                      <div className="editproduct-image-previews">
                        <h5>New Images ({color.previewUrls.length})</h5>
                        <div className="editproduct-preview-grid">
                          {color.previewUrls.map((url, imageIndex) => (
                            <div key={`new-${imageIndex}`} className="editproduct-image-preview" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                              <Image
                                src={url}
                                alt={`New ${imageIndex + 1}`}
                                width={150}
                                height={150}
                                style={{ objectFit: 'cover', width: '100%', height: '150px' }}
                                onError={(e) => {
                                  e.target.src = '/placeholder-product.jpg';
                                }}
                              />
                              <button
                                type="button"
                                className="editproduct-remove-image-btn"
                                onClick={() => removeColorImage(colorIndex, imageIndex, false)}
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
              className="editproduct-add-btn"
              onClick={addColor}
            >
              <FaPlus /> Add Color
            </button>
          </div>

          {/* Sizes & Pricing */}
          <div className="editproduct-form-section">
            <h2>Sizes & Pricing</h2>
            {sizes.map((size, sizeIndex) => (
              <div key={sizeIndex} className="editproduct-size-item">
                <div className="editproduct-size-header">
                  <h3>Size {sizeIndex + 1}</h3>
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      className="editproduct-remove-btn"
                      onClick={() => removeSize(sizeIndex)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="editproduct-size-inputs">
                  <div className="editproduct-form-group">
                    <label>Size</label>
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) => updateSize(sizeIndex, 'size', e.target.value)}
                      placeholder="e.g., Standard, Small, Large"
                    />
                  </div>
                  <div className="editproduct-form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={size.height}
                      onChange={(e) => updateSize(sizeIndex, 'height', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="editproduct-form-group">
                    <label>Width (cm)</label>
                    <input
                      type="number"
                      value={size.width}
                      onChange={(e) => updateSize(sizeIndex, 'width', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="editproduct-form-group">
                    <label>Depth (cm)</label>
                    <input
                      type="number"
                      value={size.depth}
                      onChange={(e) => updateSize(sizeIndex, 'depth', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="editproduct-form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={size.weight}
                      onChange={(e) => updateSize(sizeIndex, 'weight', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="editproduct-form-group">
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
                  <div className="editproduct-form-group">
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
                  <div className="editproduct-form-group">
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
                  <div className="editproduct-form-group">
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
              className="editproduct-add-btn"
              onClick={addSize}
            >
              <FaPlus /> Add Size
            </button>
          </div>

          {/* Additional Information */}
          <div className="editproduct-form-section">
            <h2>Additional Information</h2>
            <div className="editproduct-form-grid">
              <div className="editproduct-form-group">
                <label>Product Details</label>
                <textarea
                  name="product_detail"
                  value={formData.product_detail}
                  onChange={handleInputChange}
                  placeholder="Detailed product information..."
                  rows="3"
                />
              </div>
              <div className="editproduct-form-group">
                <label>Shipping Information</label>
                <textarea
                  name="shipping_info"
                  value={formData.shipping_info}
                  onChange={handleInputChange}
                  placeholder="Shipping details..."
                  rows="3"
                />
              </div>
              <div className="editproduct-form-group">
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

          {/* Product Attributes */}
          <div className="editproduct-form-section">
            <div className="editproduct-section-header">
              <h2>Product Attributes</h2>
              <button
                type="button"
                className="editproduct-add-btn"
                onClick={addAttribute}
              >
                <FaPlus /> Add Attribute
              </button>
            </div>
            {selectedAttributes.map((attr, attrIndex) => (
              <div key={attrIndex} className="editproduct-attribute-item">
                <div className="editproduct-attribute-header">
                  <h3>Attribute {attrIndex + 1}</h3>
                  <button
                    type="button"
                    className="editproduct-remove-btn"
                    onClick={() => removeAttribute(attrIndex)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="editproduct-attribute-inputs">
                  <div className="editproduct-form-group">
                    <label>Attribute Name</label>
                    <select
                      value={attr.name}
                      onChange={(e) => {
                        updateAttribute(attrIndex, 'name', e.target.value);
                        if (e.target.value) {
                          fetchAttributeValues(e.target.value);
                        }
                      }}
                    >
                      <option value="">Select Attribute Name</option>
                      {availableAttributeNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="editproduct-form-group">
                    <label>Attribute Value</label>
                    <select
                      value={attr.value}
                      onChange={(e) => updateAttribute(attrIndex, 'value', e.target.value)}
                      disabled={!attr.name}
                    >
                      <option value="">Select Value</option>
                      {attr.name && attributeValuesMap[attr.name]?.map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {selectedAttributes.length === 0 && (
              <p className="editproduct-info-text">
                Click &quot;Add Attribute&quot; to assign attributes to this product.
              </p>
            )}
          </div>
        </div>

        <div className="editproduct-form-actions">
          <button
            type="button"
            className="editproduct-cancel-btn"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="editproduct-submit-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="editproduct-spinner"></div>
                Updating...
              </>
            ) : (
              <>
                <FaSave />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
