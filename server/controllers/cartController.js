const db = require('../config/db');

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { product_id, color_id, size_id, quantity = 1 } = req.body;
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

    // Check if item already exists in cart
    const [existingItem] = await db.execute(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND color_id = ? AND size_id = ?',
      [user_id, product_id, color_id || null, size_id || null]
    );

    if (existingItem.length > 0) {
      // Update quantity if item already exists
      const newQuantity = existingItem[0].quantity + quantity;
      await db.execute(
        'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ?',
        [newQuantity, existingItem[0].cart_id]
      );

      return res.json({
        success: true,
        message: 'Cart updated successfully',
        data: {
          cart_id: existingItem[0].cart_id,
          quantity: newQuantity
        }
      });
    }

    // Add new item to cart
    const [result] = await db.execute(
      'INSERT INTO cart (user_id, product_id, color_id, size_id, quantity) VALUES (?, ?, ?, ?, ?)',
      [user_id, product_id, color_id || null, size_id || null, quantity]
    );

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart_id: result.insertId,
        quantity
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Get User Cart
const getUserCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [cartItems] = await db.execute(
      `SELECT 
         c.cart_id,
         c.quantity,
         c.created_at,
         c.updated_at,
         p.product_id,
         p.name,
         p.description,
         p.status as product_status,
         pc.color_id,
         pc.color_name,
         pc.color_code,
         ps.size_id,
         ps.size,
         ps.actual_price,
         ps.sell_price,
         ps.offer_percent,
         ps.stock,
         (SELECT pi.image_url FROM product_images pi 
          WHERE pi.color_id = pc.color_id AND pi.is_default = 1 
          LIMIT 1) as default_image
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       LEFT JOIN product_colors pc ON c.color_id = pc.color_id
       LEFT JOIN product_sizes ps ON c.size_id = ps.size_id
       WHERE c.user_id = ? AND p.status = 'active'
       ORDER BY c.created_at DESC`,
      [user_id]
    );

    // Transform cart items to include proper product structure
    const transformedCartItems = cartItems.map(item => ({
      cart_id: item.cart_id,
      product_id: item.product_id,
      color_id: item.color_id,
      size_id: item.size_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      // Product details
      product: {
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        price: item.sell_price || 0,
        image: item.default_image ? `http://localhost:5000${item.default_image}` : '/src/assets/img/Bestseller1.jpg'
      },
      // Size and color details
      size_name: item.size || 'Standard',
      color_name: item.color_name || 'Default',
      sell_price: item.sell_price || 0,
      actual_price: item.actual_price || 0
    }));

    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    transformedCartItems.forEach(item => {
      totalItems += item.quantity;
      const itemPrice = item.sell_price * item.quantity;
      const itemActualPrice = item.actual_price * item.quantity;
      totalPrice += itemPrice;
      totalDiscount += (itemActualPrice - itemPrice);
    });

    res.json({
      success: true,
      data: {
        items: transformedCartItems,
        summary: {
          total_items: totalItems,
          total_price: totalPrice,
          total_discount: totalDiscount,
          total_actual_price: totalPrice + totalDiscount
        }
      }
    });

  } catch (error) {
    console.error('Get user cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Update Cart Item Quantity
const updateCartItem = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Check if cart item exists and belongs to user
    const [cartItem] = await db.execute(
      'SELECT * FROM cart WHERE cart_id = ? AND user_id = ?',
      [cart_id, user_id]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Update quantity
    await db.execute(
      'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ?',
      [quantity, cart_id]
    );

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        cart_id,
        quantity
      }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove Item from Cart
const removeFromCart = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const user_id = req.user.id;

    // Check if cart item exists and belongs to user
    const [cartItem] = await db.execute(
      'SELECT * FROM cart WHERE cart_id = ? AND user_id = ?',
      [cart_id, user_id]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Remove item
    await db.execute('DELETE FROM cart WHERE cart_id = ?', [cart_id]);

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear User Cart
const clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    await db.execute('DELETE FROM cart WHERE user_id = ?', [user_id]);

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Get Cart Count
const getCartCount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [result] = await db.execute(
      `SELECT COUNT(*) as count, SUM(c.quantity) as total_items
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ? AND p.status = 'active'`,
      [user_id]
    );

    res.json({
      success: true,
      data: {
        count: result[0].count || 0,
        total_items: result[0].total_items || 0
      }
    });

  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting cart count',
      error: error.message
    });
  }
};

module.exports = {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};
