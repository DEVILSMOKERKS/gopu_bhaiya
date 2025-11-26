const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const { comparePassword, hashPassword } = require('../utils/bcryptUtil');
const { sendPasswordResetEmail } = require('../utils/emailSender');
const crypto = require('crypto');

// Helper function to generate JWT token for admin
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'admin'
    },
    process.env.JWT_SECRET,
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

// @desc    Admin signin
// @route   POST /api/admin/signin
// @access  Public
const adminSignin = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { email, password } = req.body;

    // Find admin by email
    const [admins] = await db.execute(
      'SELECT id, name, email, password, photo, is_verified, created_at FROM admins WHERE email = ?',
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    const admin = admins[0];

    // Check if admin is verified
    if (!admin.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified. Please contact the system administrator.',
        data: null,
        notVerified: true
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    // Remove password from admin object
    delete admin.password;

    // Generate JWT token
    const token = generateAdminToken(admin);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin,
        token
      }
    });

  } catch (error) {
    console.error('Admin signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Forgot password
// @route   POST /api/admin/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { email } = req.body;

    console.log('🔍 Password reset requested for email:', email);

    // Check if admin exists
    const [admins] = await db.execute(
      'SELECT id, name, email FROM admins WHERE email = ?',
      [email]
    );

    if (admins.length === 0) {
      console.log('❌ No admin found with email:', email);
      return res.status(404).json({
        success: false,
        message: 'No admin account found with this email address',
        data: null
      });
    }

    const admin = admins[0];
    console.log('✅ Admin found:', admin.name);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log('🔐 Generated reset token:', resetToken.substring(0, 10) + '...');

    // Store reset token in database
    await db.execute(
      'UPDATE admins SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, admin.id]
    );

    console.log('💾 Reset token stored in database');

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`;
    console.log('🔗 Reset link generated:', resetLink);

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ Email configuration missing. Showing reset link in development mode.');
      console.log('📧 To enable email sending, add EMAIL_USER and EMAIL_PASSWORD to .env file');
      
      return res.json({
        success: true,
        message: 'Password reset link generated (email not configured)',
        data: {
          resetLink: resetLink,
          note: 'Email sending is not configured. Please check server console for reset link.'
        }
      });
    }

    // Send password reset email
    console.log('📧 Attempting to send email to:', admin.email);
    const emailResult = await sendPasswordResetEmail(admin.email, admin.name, resetLink);

    if (emailResult.success) {
      console.log('✅ Email sent successfully!');
      res.json({
        success: true,
        message: 'Password reset link has been sent to your email address',
        data: {
          resetLink: process.env.NODE_ENV === 'development' ? resetLink : null
        }
      });
    } else {
      // If email sending fails, still return success but log the error
      console.error('❌ Email sending failed:', emailResult.error);
      console.log('📧 Email error details:', emailResult.message);
      
      // In development, still return the reset link
      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Development mode - Password reset link:', resetLink);
        res.json({
          success: true,
          message: 'Password reset link generated (email sending failed in development)',
          data: {
            resetLink: resetLink,
            note: 'Email failed to send. Use the reset link above to reset your password.'
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send reset email. Please try again later.',
          data: null
        });
      }
    }

  } catch (error) {
    console.error('💥 Forgot password error:', error);
    
    // Check if it's a nodemailer error
    if (error.message.includes('Cannot find module') && error.message.includes('nodemailer')) {
      console.log('🔧 Solution: Install nodemailer with: npm install nodemailer');
    }
    
    if (error.message.includes('Invalid login')) {
      console.log('🔧 Solution: Check EMAIL_USER and EMAIL_PASSWORD in .env file');
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Reset password
// @route   POST /api/admin/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Check for validation errors
    const hasValidationErrors = handleValidationErrors(req, res);
    if (hasValidationErrors) return;

    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required',
        data: null
      });
    }

    // Find admin with valid reset token
    const [admins] = await db.execute(
      'SELECT id, name, email FROM admins WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (admins.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
        data: null
      });
    }

    const admin = admins[0];

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    await db.execute(
      'UPDATE admins SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, admin.id]
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully',
      data: null
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/me
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  try {
    const [admins] = await db.execute(
      'SELECT id, name, email, photo, is_verified, created_at FROM admins WHERE id = ?',
      [req.user.id]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: {
        admin: admins[0]
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private (Admin)
const adminLogout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    res.json({
      success: true,
      message: 'Admin logged out successfully',
      data: null
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT id, name, email, photo, phone, dob, anniversary, address, status, created_at 
      FROM user 
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM user WHERE 1=1';
    let params = [];
    let countParams = [];

    // Add search filter
    if (search) {
      const searchCondition = 'AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      query += searchCondition;
      countQuery += searchCondition;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
      countParams.push(searchParam, searchParam, searchParam);
    }

    // Add status filter
    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    // Add pagination
    query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    // Execute queries
    const [users] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, countParams);
    const totalUsers = countResult[0].total;

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalUsers / limitNum),
          totalUsers,
          usersPerPage: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.execute(
      'SELECT id, name, email, photo, phone, dob, anniversary, address, status, created_at FROM user WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Update user status (Admin only)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Active', 'Inactive', 'Blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Active, Inactive, Blocked',
        data: null
      });
    }

    // Check if user exists
    const [users] = await db.execute(
      'SELECT id, name, email, status FROM user WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Update user status
    await db.execute(
      'UPDATE user SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: `User status updated to ${status} successfully`,
      data: {
        userId: id,
        newStatus: status
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.execute(
      'SELECT id, name, email FROM user WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Delete user
    await db.execute('DELETE FROM user WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        userId: id
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const [totalUsersResult] = await db.execute('SELECT COUNT(*) as total FROM user');
    const totalUsers = totalUsersResult[0].total;

    // Get users by status
    const [statusStats] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM user 
      GROUP BY status
    `);

    // Get recent users (last 7 days)
    const [recentUsersResult] = await db.execute(`
      SELECT COUNT(*) as count 
      FROM user 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const recentUsers = recentUsersResult[0].count;

    // Get users by month (last 6 months)
    const [monthlyStats] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM user 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `);

    res.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        totalUsers,
        statusStats,
        recentUsers,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

module.exports = {
  adminSignin,
  forgotPassword,
  resetPassword,
  getAdminProfile,
  adminLogout,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats
};
