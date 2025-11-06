const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { body, validationResult } = require('express-validator');

// @route   GET /api/testimonials
// @desc    Get all approved testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [testimonials] = await sequelize.query(
      `SELECT * FROM testimonials WHERE status = 'approved' ORDER BY featured DESC, createdAt DESC`
    );

    res.json({ success: true, testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/testimonials
// @desc    Submit a testimonial
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, rating, comment, image } = req.body;

    await sequelize.query(
      `INSERT INTO testimonials (name, email, rating, comment, image, status) 
       VALUES (:name, :email, :rating, :comment, :image, 'pending')`,
      {
        replacements: { name, email, rating, comment, image: image || null }
      }
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed before publishing.'
    });
  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

