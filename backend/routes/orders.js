const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, [
  body('items').isArray().notEmpty().withMessage('Items are required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount is required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    // Validate items and check stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'razorpay',
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update stock (will be reverted if payment fails)
    for (const item of items) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only, handled in admin routes)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Users can only cancel their own pending orders
    if (status === 'cancelled' && order.status === 'pending') {
      await order.update({ status: 'cancelled' });
      return res.json({ success: true, message: 'Order cancelled', order });
    }

    res.status(403).json({ success: false, message: 'Cannot update order status' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

