const express = require('express');
const { authenticateAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/multer');
const {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controllers/subcategoryController');

const router = express.Router();

// Get all subcategories
router.get('/', getAllSubcategories);

// Get single subcategory by ID
router.get('/:id', getSubcategoryById);

// Create new subcategory (Admin only)
router.post('/', authenticateAdmin, upload.single('image', '/subcategories'), createSubcategory);

// Update subcategory (Admin only)
router.put('/:id', authenticateAdmin, upload.single('image', '/subcategories'), updateSubcategory);

// Delete subcategory (Admin only)
router.delete('/:id', authenticateAdmin, deleteSubcategory);

module.exports = router;
