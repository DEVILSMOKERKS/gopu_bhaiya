const express = require('express');
const { authenticateAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/multer');
const {
  getAllCategories,
  getCategoryById,
  getSubcategoriesByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

// Get single category by ID
router.get('/:id', getCategoryById);

// Get subcategories for a category
router.get('/:id/subcategories', getSubcategoriesByCategory);

// Create new category (Admin only)
router.post('/', authenticateAdmin, upload.single('image', '/categories'), createCategory);

// Update category (Admin only)
router.put('/:id', authenticateAdmin, upload.single('image', '/categories'), updateCategory);

// Delete category (Admin only)
router.delete('/:id', authenticateAdmin, deleteCategory);

module.exports = router;
