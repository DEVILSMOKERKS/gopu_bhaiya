const db = require('../config/db');

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const [product] = await db.execute(
      'SELECT * FROM products WHERE product_id = ? AND status = "active"',
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    // Check if item already exists in wishlist
    const [existingItem] = await db.execute(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existingItem.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const [result] = await db.execute(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [user_id, product_id]
    );

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: {
        wishlist_id: result.insertId
      }
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product to wishlist',
      error: error.message
    });
  }
};

// Get User Wishlist
const getUserWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [wishlistItems] = await db.execute(
      `SELECT 
         w.wishlist_id,
         w.created_at,
         p.product_id,
         p.name,
         p.description,
         p.fitting_info,
         p.fabric_info,
         p.care_info,
         p.product_detail,
         p.shipping_info,
         p.return_policy,
         p.status as product_status,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price,
         MIN(ps.actual_price) as min_actual_price,
         MAX(ps.actual_price) as max_actual_price
       FROM wishlist w
       JOIN products p ON w.product_id = p.product_id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       WHERE w.user_id = ? AND p.status = 'active'
       GROUP BY w.wishlist_id, p.product_id
       ORDER BY w.created_at DESC`,
      [user_id]
    );

    // Get colors and sizes for each product
    for (let item of wishlistItems) {
      // Get colors with images
      const [colors] = await db.execute(
        `SELECT 
           pc.color_id,
           pc.color_name,
           pc.color_code,
           GROUP_CONCAT(pi.image_url) as images
         FROM product_colors pc
         LEFT JOIN product_images pi ON pc.color_id = pi.color_id
         WHERE pc.product_id = ?
         GROUP BY pc.color_id`,
        [item.product_id]
      );

      item.colors = colors.map(color => ({
        ...color,
        images: color.images ? color.images.split(',') : []
      }));

      // Get sizes
      const [sizes] = await db.execute(
        'SELECT * FROM product_sizes WHERE product_id = ?',
        [item.product_id]
      );
      item.sizes = sizes;
    }

    res.json({
      success: true,
      data: {
        items: wishlistItems,
        total_items: wishlistItems.length
      }
    });

  } catch (error) {
    console.error('Get user wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { wishlist_id } = req.params;
    const user_id = req.user.id;

    // Check if wishlist item exists and belongs to user
    const [wishlistItem] = await db.execute(
      'SELECT * FROM wishlist WHERE wishlist_id = ? AND user_id = ?',
      [wishlist_id, user_id]
    );

    if (wishlistItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    // Remove item
    await db.execute('DELETE FROM wishlist WHERE wishlist_id = ?', [wishlist_id]);

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing product from wishlist',
      error: error.message
    });
  }
};

// Remove from Wishlist by Product ID
const removeFromWishlistByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.id;

    // Check if wishlist item exists and belongs to user
    const [wishlistItem] = await db.execute(
      'SELECT * FROM wishlist WHERE product_id = ? AND user_id = ?',
      [product_id, user_id]
    );

    if (wishlistItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    // Remove item
    await db.execute(
      'DELETE FROM wishlist WHERE product_id = ? AND user_id = ?',
      [product_id, user_id]
    );

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove from wishlist by product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing product from wishlist',
      error: error.message
    });
  }
};

// Clear User Wishlist
const clearWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    await db.execute('DELETE FROM wishlist WHERE user_id = ?', [user_id]);

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message
    });
  }
};

// Get Wishlist Count
const getWishlistCount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [result] = await db.execute(
      `SELECT COUNT(*) as count
       FROM wishlist w
       JOIN products p ON w.product_id = p.product_id
       WHERE w.user_id = ? AND p.status = 'active'`,
      [user_id]
    );

    res.json({
      success: true,
      data: {
        count: result[0].count || 0
      }
    });

  } catch (error) {
    console.error('Get wishlist count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting wishlist count',
      error: error.message
    });
  }
};

// Check if Product is in Wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.id;

    const [wishlistItem] = await db.execute(
      'SELECT wishlist_id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    res.json({
      success: true,
      data: {
        is_in_wishlist: wishlistItem.length > 0,
        wishlist_id: wishlistItem.length > 0 ? wishlistItem[0].wishlist_id : null
      }
    });

  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist status',
      error: error.message
    });
  }
};

module.exports = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  clearWishlist,
  getWishlistCount,
  checkWishlistStatus
};
