// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }
  return { isValid: true, message: '' };
};

// Name validation
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  if (name.length > 100) {
    return { isValid: false, message: 'Name must be less than 100 characters' };
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  return { isValid: true, message: '' };
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true, message: '' }; // Optional field
  }
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  return { isValid: true, message: '' };
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: true, message: '' }; // Optional field
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
  const today = new Date();
  if (dateObj > today) {
    return { isValid: false, message: `${fieldName} cannot be in the future` };
  }
  return { isValid: true, message: '' };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: '' };
};

// File validation for profile photo
export const validateFile = (file, maxSize = 5 * 1024 * 1024) => { // 5MB default
  if (!file) {
    return { isValid: true, message: '' }; // Optional field
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { isValid: false, message: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }
  
  return { isValid: true, message: '' };
};

// Address validation
export const validateAddress = (address) => {
  if (!address) {
    return { isValid: true, message: '' }; // Optional field
  }
  
  if (typeof address === 'string') {
    try {
      JSON.parse(address);
    } catch (error) {
      return { isValid: false, message: 'Invalid address format' };
    }
  }
  
  return { isValid: true, message: '' };
};

// Complete form validation for signup
export const validateSignupForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Validate confirm password
  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message;
  }
  
  // Validate phone (optional)
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message;
  }
  
  // Validate dates (optional)
  if (formData.dob) {
    const dobValidation = validateDate(formData.dob, 'Date of birth');
    if (!dobValidation.isValid) {
      errors.dob = dobValidation.message;
    }
  }
  
  if (formData.anniversary) {
    const anniversaryValidation = validateDate(formData.anniversary, 'Anniversary');
    if (!anniversaryValidation.isValid) {
      errors.anniversary = anniversaryValidation.message;
    }
  }
  
  // Validate address (optional)
  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.message;
  }
  
  // Validate file (optional)
  if (formData.photo) {
    const fileValidation = validateFile(formData.photo);
    if (!fileValidation.isValid) {
      errors.photo = fileValidation.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Complete form validation for signin
export const validateSigninForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Real-time validation helper
export const validateField = (fieldName, value, additionalData = {}) => {
  switch (fieldName) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    case 'confirmPassword':
      return validateConfirmPassword(additionalData.password, value);
    case 'phone':
      return validatePhone(value);
    case 'dob':
      return validateDate(value, 'Date of birth');
    case 'anniversary':
      return validateDate(value, 'Anniversary');
    case 'address':
      return validateAddress(value);
    case 'photo':
      return validateFile(value);
    default:
      return { isValid: true, message: '' };
  }
};
