const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authenticateToken = require('../middleware/auth');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/active', couponController.getActiveCoupons);
router.get('/validate/:code', couponController.validateCoupon);

// Protected routes (user authentication required)
router.post('/apply', authenticateToken, couponController.applyCoupon);

// Admin routes (admin authentication required)
router.get('/admin/all', authenticateAdmin, couponController.getAllCoupons);
router.get('/admin/:coupon_id', authenticateAdmin, couponController.getCouponById);
router.post('/admin', authenticateAdmin, couponController.createCoupon);
router.put('/admin/:coupon_id', authenticateAdmin, couponController.updateCoupon);
router.delete('/admin/:coupon_id', authenticateAdmin, couponController.deleteCoupon);

module.exports = router;
