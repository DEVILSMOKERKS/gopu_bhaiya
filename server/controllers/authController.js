const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/bcryptUtil');
const { sendEmail } = require('../utils/emailSender');

// Helper function to generate JWT token
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789';

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user'
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
    return true; // Return true to indicate there were errors
  }
  return false; // Return false to indicate no errors
};

// @desc    Register a new user (for guest checkout)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      postalCode,
      country
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id, email FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user with additional fields
    let result;
    try {
      const [insertResult] = await db.execute(
        `INSERT INTO user (name, email, password, phone, address, city, postal_code, country) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `${firstName} ${lastName}`.trim(),
          email,
          hashedPassword,
          phone || null,
          address || null,
          city || null,
          postalCode || null,
          country || null
        ]
      );
      result = insertResult;
    } catch (dbError) {
      throw dbError;
    }

    // Get the created user (without password)
    const [newUser] = await db.execute(
      'SELECT id, name, email, phone, address, city, postal_code, country, status, created_at FROM user WHERE id = ?',
      [result.insertId]
    );

    // Generate JWT token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser[0],
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Register a new user (original signup)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { name, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id, email FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    let result;
    try {
      const [insertResult] = await db.execute(
        `INSERT INTO user (name, email, password) 
         VALUES (?, ?, ?)`,
        [name, email, hashedPassword]
      );
      result = insertResult;
    } catch (dbError) {
      throw dbError;
    }

    // Get the created user (without password)
    const [newUser] = await db.execute(
      'SELECT id, name, email, status, created_at FROM user WHERE id = ?',
      [result.insertId]
    );

    // Generate JWT token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser[0],
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Check if response has already been sent
    if (res.headersSent) {
      console.error('Response already sent, cannot send error response');
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Register a new user with profile photo
// @route   POST /api/auth/signup-with-photo
// @access  Public
const signupWithPhoto = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { name, email, password } = req.body;
    const photo = req.file ? req.file.filename : null;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id, email FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const [result] = await db.execute(
      `INSERT INTO user (name, email, password, photo) 
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, photo]
    );

    // Get the created user (without password)
    const [newUser] = await db.execute(
      'SELECT id, name, email, photo, status, created_at FROM user WHERE id = ?',
      [result.insertId]
    );

    // Generate JWT token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser[0],
        token
      }
    });

  } catch (error) {
    console.error('Signup with photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.execute(
      'SELECT id, name, email, password, status, created_at FROM user WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    const user = users[0];

    // Check if user is blocked or inactive
    if (user.status === 'Blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.',
        data: null,
        blocked: true
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is temporarily inactive. Please contact support.',
        data: null,
        inactive: true
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    // Remove password from user object
    delete user.password;

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, photo, dob, phone, address, is_verified, status, created_at, updated_at FROM user WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    const user = users[0];

    // Parse address JSON if it exists
    if (user.address) {
      try {
        user.address = JSON.parse(user.address);
      } catch (error) {
        console.error('Error parsing address JSON:', error);
        user.address = null;
      }
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { name, email, dob, phone, address } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it already exists
    if (email) {
      const [existingUsers] = await db.execute(
        'SELECT id FROM user WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
          data: null
        });
      }
    }

    // Prepare update fields
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (dob !== undefined) {
      updateFields.push('dob = ?');
      updateValues.push(dob);
    }

    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(JSON.stringify(address));
    }

    // Add user ID to values array
    updateValues.push(userId);

    // Update user profile
    const [result] = await db.execute(
      `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Get updated user data
    const [updatedUsers] = await db.execute(
      'SELECT id, name, email, photo, dob, phone, address, is_verified, status, created_at, updated_at FROM user WHERE id = ?',
      [userId]
    );

    const updatedUser = updatedUsers[0];

    // Parse address JSON if it exists
    if (updatedUser.address) {
      try {
        updatedUser.address = JSON.parse(updatedUser.address);
      } catch (error) {
        console.error('Error parsing address JSON:', error);
        updatedUser.address = null;
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Update user profile photo
// @route   PUT /api/auth/update-photo
// @access  Private
const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const photo = req.file ? req.file.filename : null;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: 'No photo uploaded',
        data: null
      });
    }

    // Update user photo
    const [result] = await db.execute(
      'UPDATE user SET photo = ? WHERE id = ?',
      [photo, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Get updated user data
    const [updatedUsers] = await db.execute(
      'SELECT id, name, email, photo, dob, phone, address, is_verified, status, created_at, updated_at FROM user WHERE id = ?',
      [userId]
    );

    const updatedUser = updatedUsers[0];

    // Parse address JSON if it exists
    if (updatedUser.address) {
      try {
        updatedUser.address = JSON.parse(updatedUser.address);
      } catch (error) {
        console.error('Error parsing address JSON:', error);
        updatedUser.address = null;
      }
    }

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Update profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // You could implement a blacklist here if needed
    res.json({
      success: true,
      message: 'Logged out successfully',
      data: null
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Refresh JWT token
// @route   POST /api/auth/refresh-token
// @access  Private
const refreshToken = async (req, res) => {
  try {
    // Get fresh user data
    const [users] = await db.execute(
      'SELECT id, name, email, status FROM user WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    const user = users[0];

    // Check user status
    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active',
        data: null
      });
    }

    // Generate new token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { email } = req.body;


    // Check if user exists
    const [users] = await db.execute(
      'SELECT id, name, email FROM user WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
        data: null
      });
    }

    const user = users[0];

    // Generate JWT reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'password_reset'
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789',
      { expiresIn: '1h' }
    );


    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const emailSubject = 'Password Reset Request - Mateshwari Moorti Bhandar';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #9a0e0d; margin: 0;">Mateshwari Moorti Bhandar</h1>
          <p style="color: #666; margin: 5px 0;">Handcrafted Marble Idols & Temples</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.name},
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Mateshwari Moorti Bhandar account. If you made this request, click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #9a0e0d, #764ba2); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: 600;">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #9a0e0d; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
            ${resetLink}
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 14px;">
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>© 2024 Mateshwari Moorti Bhandar. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail(user.email, emailSubject, emailHtml);

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email address',
      data: {
        email: user.email,
        expiresIn: '1 hour'
      }
    });

  } catch (error) {
    console.error('💥 Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { token, password } = req.body;


    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_make_it_long_and_random_123456789');

      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new password reset.',
        data: null
      });
    }

    // Get user from database
    const [users] = await db.execute(
      'SELECT id, name, email FROM user WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User not found. Please request a new password reset.',
        data: null
      });
    }

    const user = users[0];

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update password
    await db.execute(
      'UPDATE user SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );


    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
      data: {
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('💥 Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = {
  register,
  signup,
  signupWithPhoto,
  signin,
  getProfile,
  updateProfile,
  updateProfilePhoto,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};
