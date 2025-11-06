const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findOne({
      where: { id: orderId, userId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    await order.update({ razorpayOrderId: razorpayOrder.id });

    res.json({
      success: true,
      order: razorpayOrder
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: 'Payment order creation failed' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      // Payment verified
      const order = await Order.findOne({
        where: { id: orderId, userId: req.user.id }
      });

      if (order) {
        await order.update({
          paymentStatus: 'completed',
          razorpayPaymentId,
          status: 'processing'
        });

        res.json({
          success: true,
          message: 'Payment verified successfully'
        });
      } else {
        res.status(404).json({ success: false, message: 'Order not found' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;

