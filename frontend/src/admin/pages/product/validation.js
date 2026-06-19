// Product validation utilities
export const validateProduct = (formData, colors, sizes) => {
  const errors = [];

  // Basic validation
  if (!formData.name || formData.name.trim() === '') {
    errors.push('Product name is required');
  }

  // Color validation
  if (!colors || colors.length === 0) {
    errors.push('At least one color is required');
  } else {
    colors.forEach((color, index) => {
      if (!color.name || color.name.trim() === '') {
        errors.push(`Color ${index + 1} name is required`);
      }
      if (!color.images || color.images.length === 0) {
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

export const validateImageUpload = (colors) => {
  const errors = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!colors || colors.length === 0) {
    errors.push('At least one color with images is required');
    return { isValid: false, errors };
  }

  let totalImages = 0;
  colors.forEach((color, colorIndex) => {
    if (color.images && color.images.length > 0) {
      totalImages += color.images.length;
      
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

  if (totalImages > 20) {
    errors.push('Maximum 20 total images allowed across all colors');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const showValidationErrors = (errors) => {
  if (errors.length > 0) {
    const errorMessage = errors.join('\n');
    alert(`Please fix the following errors:\n\n${errorMessage}`);
    return false;
  }
  return true;
};
