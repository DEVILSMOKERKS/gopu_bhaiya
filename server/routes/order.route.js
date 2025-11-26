const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/auth');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.post('/create', orderController.createOrder);
router.post('/create-cod', orderController.createCodOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.post('/webhook', orderController.verifyPayment); // Webhook endpoint for Razorpay
router.get('/track/:orderNumber', orderController.trackOrder);
router.get('/check-courier', orderController.checkCourierServiceability);
router.get('/test-shiprocket', orderController.testShiprocketConnection);

// Protected routes (require authentication)
router.use(authenticateToken);

// Order management
router.get('/my-orders', orderController.getUserOrders);
router.get('/order/:orderId', orderController.getOrderById);
router.post('/cancel/:orderId', orderController.cancelOrder);
router.post('/return/:orderId', orderController.returnOrder);



// Admin routes (require admin authentication)
router.get('/admin/all', authenticateAdmin, orderController.getAllOrders);
router.get('/admin/order/:orderId', authenticateAdmin, orderController.getOrderDetails);
router.put('/admin/update-status/:orderId', authenticateAdmin, orderController.updateOrderStatus);
router.put('/admin/update-tracking/:orderId', authenticateAdmin, orderController.updateTrackingInfo);
router.get('/admin/analytics', authenticateAdmin, orderController.getOrderAnalytics);
router.get('/admin/recent-orders', authenticateAdmin, orderController.getRecentOrders);

module.exports = router;
