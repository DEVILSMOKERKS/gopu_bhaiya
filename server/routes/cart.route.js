const express = require('express');
const router = express.Router();
const  protect  = require('../middleware/auth');
const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(protect);

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', addToCart);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getUserCart);

// @route   PUT /api/cart/:cart_id
// @desc    Update cart item quantity
// @access  Private
router.put('/:cart_id', updateCartItem);

// @route   DELETE /api/cart/:cart_id
// @desc    Remove item from cart
// @access  Private
router.delete('/:cart_id', removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear user's cart
// @access  Private
router.delete('/', clearCart);

// @route   GET /api/cart/count
// @desc    Get cart count
// @access  Private
router.get('/count', getCartCount);

module.exports = router;
