const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [results] = await sequelize.query(
      `SELECT p.* FROM products p 
       INNER JOIN wishlist w ON p.id = w.productId 
       WHERE w.userId = :userId`,
      {
        replacements: { userId: req.user.id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json({ success: true, wishlist: results });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/:productId', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if already in wishlist
    const [existing] = await sequelize.query(
      `SELECT * FROM wishlist WHERE userId = :userId AND productId = :productId`,
      {
        replacements: { userId: req.user.id, productId: req.params.productId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existing) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    await sequelize.query(
      `INSERT INTO wishlist (userId, productId) VALUES (:userId, :productId)`,
      {
        replacements: { userId: req.user.id, productId: req.params.productId }
      }
    );

    res.json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    await sequelize.query(
      `DELETE FROM wishlist WHERE userId = :userId AND productId = :productId`,
      {
        replacements: { userId: req.user.id, productId: req.params.productId }
      }
    );

    res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

