const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/multer');

// Public routes
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:slug', blogController.getBlogBySlug);

// Admin routes (protected)
router.get('/admin/blogs', auth, blogController.adminGetAllBlogs);
router.get('/admin/blogs/:id', auth, blogController.adminGetBlogById);

router.post('/admin/blogs', auth, upload.single('featured_image', '/blogs'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('status').isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('meta_title').optional(),
  body('meta_description').optional(),
  body('tags').optional()
], blogController.createBlog);

router.put('/admin/blogs/:id', auth, upload.single('featured_image', '/blogs'), [
  body('title').optional(),
  body('content').optional(),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('meta_title').optional(),
  body('meta_description').optional(),
  body('tags').optional()
], blogController.updateBlog);

router.delete('/admin/blogs/:id', auth, blogController.deleteBlog);

module.exports = router;
