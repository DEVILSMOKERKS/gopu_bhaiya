const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomRequest = require('../models/CustomRequest');
const Review = require('../models/Review');
const { adminAuth } = require('../middleware/auth');

// Products Management
router.post('/products', adminAuth, [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').isIn(['Temples', 'Idols', 'Decor', 'Custom Orders']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.update(req.body);
    res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Orders Management
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/orders/:id/status', adminAuth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  body('trackingNumber').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.update({
      status: req.body.status,
      trackingNumber: req.body.trackingNumber || order.trackingNumber
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Custom Requests Management
router.get('/custom-requests', adminAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const requests = await CustomRequest.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get custom requests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/custom-requests/:id', adminAuth, [
  body('status').isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('estimatedPrice').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const request = await CustomRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    await request.update(req.body);
    res.json({ success: true, request });
  } catch (error) {
    console.error('Update custom request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount', {
      where: { paymentStatus: 'completed' }
    });
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const customRequests = await CustomRequest.count({ where: { status: 'pending' } });

    res.json({
      success: true,
      analytics: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue || 0,
        pendingOrders,
        customRequests
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

