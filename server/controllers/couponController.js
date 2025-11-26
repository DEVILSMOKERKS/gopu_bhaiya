const db = require('../config/db');

// Get Active Coupons
const getActiveCoupons = async (req, res) => {
  try {
    const [coupons] = await db.execute(
      `SELECT * FROM coupons 
       WHERE status = 'active' 
       AND valid_from <= CURDATE() 
       AND valid_to >= CURDATE()
       AND used_count < usage_limit
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: coupons
    });

  } catch (error) {
    console.error('Get active coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active coupons',
      error: error.message
    });
  }
};

// Validate Coupon
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;

    const [coupons] = await db.execute(
      'SELECT * FROM coupons WHERE code = ? AND status = "active" AND valid_from <= CURDATE() AND valid_to >= CURDATE()',
      [code]
    );

    if (coupons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }

    const coupon = coupons[0];

    // Check usage limit
    if (coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit exceeded'
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        coupon
      }
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message
    });
  }
};

// Apply Coupon
const applyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const userId = req.user.id;

    const [coupons] = await db.execute(
      'SELECT * FROM coupons WHERE code = ? AND status = "active" AND valid_from <= CURDATE() AND valid_to >= CURDATE()',
      [code]
    );

    if (coupons.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }

    const coupon = coupons[0];

    // Check minimum order amount
    if (subtotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`
      });
    }

    // Check usage limit
    if (coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit exceeded'
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    res.json({
      success: true,
      data: {
        coupon,
        discount: parseFloat(discount.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying coupon',
      error: error.message
    });
  }
};

// Admin: Get All Coupons
const getAllCoupons = async (req, res) => {
  try {
    const [coupons] = await db.execute(
      'SELECT * FROM coupons ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: coupons
    });

  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
};

// Admin: Get Coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    const [coupons] = await db.execute(
      'SELECT * FROM coupons WHERE coupon_id = ?',
      [coupon_id]
    );

    if (coupons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupons[0]
    });

  } catch (error) {
    console.error('Get coupon by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon',
      error: error.message
    });
  }
};

// Admin: Create Coupon
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount,
      usage_limit,
      valid_from,
      valid_to,
      status
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO coupons (
        code, name, description, discount_type, discount_value, 
        min_order_amount, max_discount, usage_limit, valid_from, valid_to, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code, name, description, discount_type, discount_value,
        min_order_amount, max_discount, usage_limit, valid_from, valid_to, status
      ]
    );

    res.json({
      success: true,
      message: 'Coupon created successfully',
      data: {
        coupon_id: result.insertId
      }
    });

  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating coupon',
      error: error.message
    });
  }
};

// Admin: Update Coupon
const updateCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.params;
    const {
      code,
      name,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount,
      usage_limit,
      valid_from,
      valid_to,
      status
    } = req.body;

    await db.execute(
      `UPDATE coupons SET 
        code = ?, name = ?, description = ?, discount_type = ?, discount_value = ?,
        min_order_amount = ?, max_discount = ?, usage_limit = ?, valid_from = ?, 
        valid_to = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE coupon_id = ?`,
      [
        code, name, description, discount_type, discount_value,
        min_order_amount, max_discount, usage_limit, valid_from, valid_to, status, coupon_id
      ]
    );

    res.json({
      success: true,
      message: 'Coupon updated successfully'
    });

  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating coupon',
      error: error.message
    });
  }
};

// Admin: Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    await db.execute(
      'DELETE FROM coupons WHERE coupon_id = ?',
      [coupon_id]
    );

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon',
      error: error.message
    });
  }
};

module.exports = {
  getActiveCoupons,
  validateCoupon,
  applyCoupon,
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
