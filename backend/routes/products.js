const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      material,
      featured,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 12
    } = req.query;

    const where = { status: 'active' };

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (material) {
      where.material = { [Op.like]: `%${material}%` };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      products: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product with reviews
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get reviews with user info
    const User = require('../models/User');
    const reviews = await Review.findAll({
      where: { productId: product.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      product: {
        ...product.toJSON(),
        reviews,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/products/featured/all
// @desc    Get all featured products
// @access  Public
router.get('/featured/all', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { featured: true, status: 'active' },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({ success: true, products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

