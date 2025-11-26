import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiCalendar, 
  HiLocationMarker, 
  HiCamera,
  HiPencil,
  HiCheck,
  HiX,
  HiLogout,
  HiShieldCheck,
  HiClock,
  HiShoppingBag
} from 'react-icons/hi';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUser, updateProfile, updateProfilePhoto, loading, error, success, clearError, clearSuccess } = useUser();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob ? user.dob.split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => clearSuccess(), 5000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearSuccess, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handlePhotoUpdate = async () => {
    if (!photoFile) return;

    const result = await updateProfilePhoto(photoFile);
    if (result.success) {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileImage = () => {
    if (photoPreview) return photoPreview;
    if (user?.photo) return `${API_URL.replace('/api', '')}/profile/${user.photo}`;
    return null;
  };

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="user-profile-loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {/* Profile Navigation */}
      <div className="user-profile-navigation">
        <div className="user-profile-nav-item active">
          <HiUser />
          <span>Profile</span>
        </div>
        <div className="user-profile-nav-item" onClick={() => navigate('/orders')}>
          <HiShoppingBag />
          <span>My Orders</span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="user-profile-message user-profile-message-success">
          <HiCheck />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="user-profile-message user-profile-message-error">
          <HiX />
          <span>{error.message || error}</span>
        </div>
      )}

      <div className="user-profile-content">
        {/* Profile Information */}
        <div className="user-profile-info-section">
          <div className="user-profile-info-header">
            <h2>Personal Information</h2>
            <div className="user-profile-actions">
              {isEditing ? (
                <>
                  <button className="user-profile-btn user-profile-btn-primary" onClick={handleProfileUpdate}>
                    <HiCheck />
                    Save Changes
                  </button>
                  <button className="user-profile-btn user-profile-btn-secondary" onClick={() => setIsEditing(false)}>
                    <HiX />
                    Cancel
                  </button>
                </>
              ) : (
                <button className="user-profile-btn user-profile-btn-outline" onClick={() => setIsEditing(true)}>
                  <HiPencil />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Photo Section - Moved inside */}
          <div className="user-profile-photo-section">
            <div className="user-profile-photo-container">
              <div className="user-profile-photo">
                {getProfileImage() ? (
                  <img src={getProfileImage()} alt="Profile" />
                ) : (
                  <div className="user-profile-photo-placeholder">
                    <HiUser />
                  </div>
                )}
                <div className="user-profile-photo-overlay">
                  <label htmlFor="photo-upload" className="user-profile-photo-upload-btn">
                    <HiCamera />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              {photoFile && (
                <div className="user-profile-photo-actions">
                  <button 
                    className="user-profile-btn user-profile-btn-primary"
                    onClick={handlePhotoUpdate}
                    disabled={isPhotoUploading}
                  >
                    {isPhotoUploading ? 'Uploading...' : 'Save Photo'}
                  </button>
                  <button 
                    className="user-profile-btn user-profile-btn-secondary"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="user-profile-info-grid">
            {/* Name */}
            <div className="user-profile-info-field">
              <div className="user-profile-field-label">
                <HiUser />
                <span>Full Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="user-profile-field-value">{user.name || 'Not set'}</div>
              )}
            </div>

            {/* Email */}
            <div className="user-profile-info-field">
              <div className="user-profile-field-label">
                <HiMail />
                <span>Email Address</span>
                {user.is_verified && (
                  <span className="user-profile-verified-badge">
                    <HiShieldCheck />
                    Verified
                  </span>
                )}
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="user-profile-field-value">{user.email}</div>
              )}
            </div>

            {/* Phone */}
            <div className="user-profile-info-field">
              <div className="user-profile-field-label">
                <HiPhone />
                <span>Phone Number</span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="user-profile-field-value">{user.phone || 'Not set'}</div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="user-profile-info-field">
              <div className="user-profile-field-label">
                <HiCalendar />
                <span>Date of Birth</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="user-profile-field-value">{formatDate(user.dob)}</div>
              )}
            </div>

            {/* Address */}
            <div className="user-profile-info-field user-profile-address-field">
              <div className="user-profile-field-label">
                <HiLocationMarker />
                <span>Address</span>
              </div>
              {isEditing ? (
                <div className="user-profile-address-inputs">
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                  />
                  <div className="user-profile-address-row">
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                  </div>
                  <div className="user-profile-address-row">
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                    />
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                  </div>
                </div>
              ) : (
                <div className="user-profile-field-value">
                  {user.address ? (
                    <div className="user-profile-address-display">
                      <div>{user.address.street}</div>
                      <div>{user.address.city}, {user.address.state} {user.address.zipCode}</div>
                      <div>{user.address.country}</div>
                    </div>
                  ) : (
                    'Not set'
                  )}
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="user-profile-info-field">
              <div className="user-profile-field-label">
                <HiShieldCheck />
                <span>Account Status</span>
              </div>
              <div className="user-profile-field-value">
                <span className={`user-profile-status-badge ${user.status?.toLowerCase()}`}>
                  {user.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div className="user-profile-info-field">
              <div className="user-profile-field-label">
                <HiClock />
                <span>Member Since</span>
              </div>
              <div className="user-profile-field-value">
                {formatDate(user.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="user-profile-actions-section">
          <h3>Account Actions</h3>
          <div className="user-profile-action-buttons">
            <button className="user-profile-btn user-profile-btn-danger" onClick={handleLogout}>
              <HiLogout />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
