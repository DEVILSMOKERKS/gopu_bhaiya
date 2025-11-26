const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateAdminSignin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateUserStatus = [
  body('status')
    .isIn(['Active', 'Inactive', 'Blocked'])
    .withMessage('Status must be one of: Active, Inactive, Blocked')
];

const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// Public routes
router.post('/signin', validateAdminSignin, adminController.adminSignin);
router.post('/forgot-password', validateForgotPassword, adminController.forgotPassword);
router.post('/reset-password', validateResetPassword, adminController.resetPassword);

// Protected routes (Admin only)
router.get('/me', authenticateAdmin, adminController.getAdminProfile);
router.post('/logout', authenticateAdmin, adminController.adminLogout);

// User management routes (Admin only)
router.get('/users', authenticateAdmin, adminController.getAllUsers);
router.get('/users/:id', authenticateAdmin, adminController.getUserById);
router.patch('/users/:id/status', authenticateAdmin, validateUserStatus, adminController.updateUserStatus);
router.delete('/users/:id', authenticateAdmin, adminController.deleteUser);

// Dashboard routes (Admin only)
router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);

module.exports = router;
