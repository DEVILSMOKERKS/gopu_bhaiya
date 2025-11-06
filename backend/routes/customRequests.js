const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CustomRequest = require('../models/CustomRequest');
const { auth } = require('../middleware/auth');

// @route   POST /api/custom-requests
// @desc    Create a custom design request
// @access  Private
router.post('/', auth, [
  body('designDescription').trim().notEmpty().withMessage('Design description is required'),
  body('preferredMaterial').optional().trim(),
  body('dimensions').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { designDescription, preferredMaterial, dimensions, imageUpload } = req.body;

    const customRequest = await CustomRequest.create({
      userId: req.user.id,
      designDescription,
      preferredMaterial,
      dimensions,
      imageUpload,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Custom request submitted successfully',
      customRequest
    });
  } catch (error) {
    console.error('Create custom request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/custom-requests
// @desc    Get user's custom requests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const requests = await CustomRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get custom requests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/custom-requests/:id
// @desc    Get single custom request
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await CustomRequest.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, request });
  } catch (error) {
    console.error('Get custom request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

