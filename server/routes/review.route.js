const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/auth');
const { upload } = require('../middleware/multer');

// Public routes (no authentication required)
router.get('/product/:product_id', reviewController.getProductReviews);

// Protected routes (user authentication required)
router.post('/', authenticateToken, upload.single('review_image', '/reviews'), reviewController.createReview);
router.get('/user/:product_id', authenticateToken, reviewController.getUserProductReview);
router.put('/:review_id', authenticateToken, upload.single('review_image', '/reviews'), reviewController.updateReview);
router.delete('/:review_id', authenticateToken, reviewController.deleteReview);
router.post('/:review_id/like', authenticateToken, reviewController.toggleReviewLike);

// Admin routes (admin authentication required)
router.get('/admin/all', authenticateToken, reviewController.getAllReviews);
router.put('/admin/:review_id/status', authenticateToken, reviewController.updateReviewStatus);
router.delete('/admin/:review_id', authenticateToken, reviewController.adminDeleteReview);

module.exports = router;
