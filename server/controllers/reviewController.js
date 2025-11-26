const db = require('../config/db');
const { upload } = require('../middleware/multer');

// Create Review
const createReview = async (req, res) => {
  try {
    const { product_id, rating, review_text } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!product_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and rating are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const [product] = await db.execute(
      'SELECT * FROM products WHERE product_id = ?',
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const [existingReview] = await db.execute(
      'SELECT * FROM product_reviews WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Handle image upload
    let review_image = null;
    if (req.file) {
      review_image = `/reviews/${req.file.filename}`;
    }

    // Create review
    const [result] = await db.execute(
      `INSERT INTO product_reviews (product_id, user_id, rating, review_text, review_image, status) 
       VALUES (?, ?, ?, ?, ?, 'approved')`,
      [product_id, user_id, rating, review_text || null, review_image]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review_id: result.insertId }
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get Reviews by Product ID
const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Get total count of approved reviews only
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM product_reviews 
       WHERE product_id = ? AND status = 'approved'`,
      [product_id]
    );

    const total = countResult[0].total;

    // Get approved reviews with user information only
    const [reviews] = await db.execute(
      `SELECT 
         pr.review_id,
         pr.rating,
         pr.review_text,
         pr.review_image,
         pr.status,
         pr.created_at,
         pr.updated_at,
         u.name as user_name,
         u.photo as user_photo,
         (SELECT COUNT(*) FROM review_likes WHERE review_id = pr.review_id) as likes_count
       FROM product_reviews pr
       LEFT JOIN user u ON pr.user_id = u.id
       WHERE pr.product_id = ? AND pr.status = 'approved'
       ORDER BY pr.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      [product_id]
    );

    // Get average rating of approved reviews only
    const [avgRating] = await db.execute(
      `SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews
       FROM product_reviews 
       WHERE product_id = ? AND status = 'approved'`,
      [product_id]
    );

    res.json({
      success: true,
      data: {
        reviews,
        average_rating: avgRating[0].average_rating || 0,
        total_reviews: avgRating[0].total_reviews || 0
      },
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum
      }
    });

  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, review_text } = req.body;
    const user_id = req.user.id;

    // Check if review exists and belongs to user
    const [existingReview] = await db.execute(
      'SELECT * FROM product_reviews WHERE review_id = ? AND user_id = ?',
      [review_id, user_id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to edit it'
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Handle image upload
    let review_image = existingReview[0].review_image;
    if (req.file) {
      review_image = `/reviews/${req.file.filename}`;
    }

    // Update review
    await db.execute(
      `UPDATE product_reviews 
       SET rating = ?, review_text = ?, review_image = ?, updated_at = CURRENT_TIMESTAMP
       WHERE review_id = ?`,
      [rating || existingReview[0].rating, review_text || existingReview[0].review_text, review_image, review_id]
    );

    res.json({
      success: true,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const user_id = req.user.id;

    // Check if review exists and belongs to user
    const [existingReview] = await db.execute(
      'SELECT * FROM product_reviews WHERE review_id = ? AND user_id = ?',
      [review_id, user_id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    // Delete review (cascade will handle likes)
    await db.execute('DELETE FROM product_reviews WHERE review_id = ?', [review_id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Like/Unlike Review
const toggleReviewLike = async (req, res) => {
  try {
    const { review_id } = req.params;
    const user_id = req.user.id;

    // Check if review exists
    const [review] = await db.execute(
      'SELECT * FROM product_reviews WHERE review_id = ?',
      [review_id]
    );

    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already liked the review
    const [existingLike] = await db.execute(
      'SELECT * FROM review_likes WHERE review_id = ? AND user_id = ?',
      [review_id, user_id]
    );

    if (existingLike.length > 0) {
      // Unlike
      await db.execute(
        'DELETE FROM review_likes WHERE review_id = ? AND user_id = ?',
        [review_id, user_id]
      );
      res.json({
        success: true,
        message: 'Review unliked successfully',
        action: 'unliked'
      });
    } else {
      // Like
      await db.execute(
        'INSERT INTO review_likes (review_id, user_id) VALUES (?, ?)',
        [review_id, user_id]
      );
      res.json({
        success: true,
        message: 'Review liked successfully',
        action: 'liked'
      });
    }

  } catch (error) {
    console.error('Toggle review like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling review like',
      error: error.message
    });
  }
};

// Get User's Review for a Product
const getUserProductReview = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.id;

    const [review] = await db.execute(
      `SELECT 
         pr.review_id,
         pr.rating,
         pr.review_text,
         pr.review_image,
         pr.status,
         pr.created_at,
         pr.updated_at
       FROM product_reviews pr
       WHERE pr.product_id = ? AND pr.user_id = ?`,
      [product_id, user_id]
    );

    res.json({
      success: true,
      data: review[0] || null
    });

  } catch (error) {
    console.error('Get user product review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user review',
      error: error.message
    });
  }
};

// Admin: Get All Reviews
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, product_id } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = [];
    let params = [];

    if (status) {
      whereConditions.push('pr.status = ?');
      params.push(status);
    }

    if (product_id) {
      whereConditions.push('pr.product_id = ?');
      params.push(product_id);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM product_reviews pr ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get reviews
    const [reviews] = await db.execute(
      `SELECT 
         pr.review_id,
         pr.rating,
         pr.review_text,
         pr.review_image,
         pr.status,
         pr.created_at,
         pr.updated_at,
         u.name as user_name,
         u.email as user_email,
         u.photo as user_photo,
         p.name as product_name,
         p.product_id,
         (SELECT COUNT(*) FROM review_likes WHERE review_id = pr.review_id) as likes_count
       FROM product_reviews pr
       LEFT JOIN user u ON pr.user_id = u.id
       LEFT JOIN products p ON pr.product_id = p.product_id
       ${whereClause}
       ORDER BY pr.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: reviews,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum
      }
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Admin: Update Review Status
const updateReviewStatus = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }

    // Check if review exists
    const [existingReview] = await db.execute(
      'SELECT * FROM product_reviews WHERE review_id = ?',
      [review_id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update status
    await db.execute(
      'UPDATE product_reviews SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE review_id = ?',
      [status, review_id]
    );

    res.json({
      success: true,
      message: 'Review status updated successfully'
    });

  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
      error: error.message
    });
  }
};

// Admin: Delete Review
const adminDeleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    // Check if review exists
    const [existingReview] = await db.execute(
      'SELECT * FROM product_reviews WHERE review_id = ?',
      [review_id]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Delete review (cascade will handle likes)
    await db.execute('DELETE FROM product_reviews WHERE review_id = ?', [review_id]);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleReviewLike,
  getUserProductReview,
  getAllReviews,
  updateReviewStatus,
  adminDeleteReview
};
