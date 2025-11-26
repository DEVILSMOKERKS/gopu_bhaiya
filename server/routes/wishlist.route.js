const express = require('express');
const router = express.Router();
const  protect  = require('../middleware/auth');
const {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  clearWishlist,
  getWishlistCount,
  checkWishlistStatus
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(protect);

// @route   POST /api/wishlist/add
// @desc    Add product to wishlist
// @access  Private
router.post('/add', addToWishlist);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', getUserWishlist);

// @route   DELETE /api/wishlist/:wishlist_id
// @desc    Remove item from wishlist by wishlist_id
// @access  Private
router.delete('/:wishlist_id', removeFromWishlist);

// @route   DELETE /api/wishlist/product/:product_id
// @desc    Remove item from wishlist by product_id
// @access  Private
router.delete('/product/:product_id', removeFromWishlistByProduct);

// @route   DELETE /api/wishlist
// @desc    Clear user's wishlist
// @access  Private
router.delete('/', clearWishlist);

// @route   GET /api/wishlist/count
// @desc    Get wishlist count
// @access  Private
router.get('/count', getWishlistCount);

// @route   GET /api/wishlist/check/:product_id
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:product_id', checkWishlistStatus);

module.exports = router;
