const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, [
  body('productId').isInt().withMessage('Product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { productId, rating, comment } = req.body;

    // Check if user has ordered this product
    const orders = await Order.findAll({
      where: { userId: req.user.id, paymentStatus: 'completed' }
    });

    const hasOrdered = orders.some(order => {
      return order.items.some(item => item.productId === productId);
    });

    if (!hasOrdered) {
      return res.status(403).json({ success: false, message: 'You must purchase this product to review it' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const User = require('../models/User');
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

