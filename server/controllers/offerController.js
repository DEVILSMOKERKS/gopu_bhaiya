const db = require('../config/db');

// Create Offer
const createOffer = async (req, res) => {
  try {
    const {
      offer_title,
      offer_description,
      discount_percent,
      valid_from,
      valid_to,
      status = 'active'
    } = req.body;

    // Validate required fields
    if (!offer_title || !discount_percent) {
      return res.status(400).json({
        success: false,
        message: 'Offer title and discount percent are required'
      });
    }

    // Validate discount percent
    if (discount_percent < 0 || discount_percent > 100) {
      return res.status(400).json({
        success: false,
        message: 'Discount percent must be between 0 and 100'
      });
    }

    // Insert offer (without product_id)
    const [result] = await db.execute(
      `INSERT INTO product_offers (offer_title, offer_description, 
       discount_percent, valid_from, valid_to, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [offer_title, offer_description || null, 
       discount_percent, valid_from || null, valid_to || null, status]
    );

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: { offer_id: result.insertId }
    });

  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: error.message
    });
  }
};

// Get All Offers
const getAllOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      min_discount,
      max_discount
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    let whereConditions = [];
    let params = [];

    if (status) {
      whereConditions.push('po.status = ?');
      params.push(status);
    }

    if (search) {
      whereConditions.push('(po.offer_title LIKE ? OR po.offer_description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (min_discount) {
      whereConditions.push('po.discount_percent >= ?');
      params.push(min_discount);
    }

    if (max_discount) {
      whereConditions.push('po.discount_percent <= ?');
      params.push(max_discount);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM product_offers po 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get offers with pagination
    const [offers] = await db.execute(
      `SELECT 
         po.offer_id,
         po.product_id,
         po.offer_title,
         po.offer_description,
         po.discount_percent,
         po.valid_from,
         po.valid_to,
         po.status,
         po.created_at,
         po.updated_at,
         p.name as product_name
       FROM product_offers po
       LEFT JOIN products p ON po.product_id = p.product_id
       ${whereClause}
       ORDER BY po.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: offers,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum
      }
    });

  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: error.message
    });
  }
};

// Get Active Offers
const getActiveOffers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    const [offers] = await db.execute(
      `SELECT 
         po.offer_id,
         po.product_id,
         po.offer_title,
         po.offer_description,
         po.discount_percent,
         po.valid_from,
         po.valid_to,
         po.status,
         po.created_at,
         po.updated_at,
         p.name as product_name
       FROM product_offers po
       LEFT JOIN products p ON po.product_id = p.product_id
       WHERE po.status = 'active'
         AND (po.valid_from IS NULL OR po.valid_from <= CURRENT_DATE)
         AND (po.valid_to IS NULL OR po.valid_to >= CURRENT_DATE)
       ORDER BY po.created_at DESC
       LIMIT ?`,
      [limitNum]
    );

    res.json({
      success: true,
      data: offers,
      message: 'Active offers retrieved successfully'
    });

  } catch (error) {
    console.error('Get active offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active offers',
      error: error.message
    });
  }
};

// Get Single Offer
const getOfferById = async (req, res) => {
  try {
    const { offer_id } = req.params;

    const [offers] = await db.execute(
      `SELECT 
         po.*,
         p.name as product_name
       FROM product_offers po
       LEFT JOIN products p ON po.product_id = p.product_id
       WHERE po.offer_id = ?`,
      [offer_id]
    );

    if (offers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      data: offers[0]
    });

  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offer',
      error: error.message
    });
  }
};

// Get Offers by Product
const getOffersByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { status } = req.query;

    let whereConditions = ['po.product_id = ?'];
    let params = [product_id];

    if (status) {
      whereConditions.push('po.status = ?');
      params.push(status);
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    const [offers] = await db.execute(
      `SELECT 
         po.*,
         p.name as product_name
       FROM product_offers po
       LEFT JOIN products p ON po.product_id = p.product_id
       ${whereClause}
       ORDER BY po.created_at DESC`,
      params
    );

    res.json({
      success: true,
      data: offers
    });

  } catch (error) {
    console.error('Get offers by product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers by product',
      error: error.message
    });
  }
};

// Update Offer
const updateOffer = async (req, res) => {
  try {
    const { offer_id } = req.params;
    const {
      offer_title,
      offer_description,
      discount_percent,
      valid_from,
      valid_to,
      status
    } = req.body;

    // Check if offer exists
    const [existingOffer] = await db.execute(
      'SELECT * FROM product_offers WHERE offer_id = ?',
      [offer_id]
    );

    if (existingOffer.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Validate discount percent if provided
    if (discount_percent !== undefined && (discount_percent < 0 || discount_percent > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Discount percent must be between 0 and 100'
      });
    }

    // Update offer (without product_id)
    await db.execute(
      `UPDATE product_offers SET 
       offer_title = ?, offer_description = ?,
       discount_percent = ?, valid_from = ?, valid_to = ?, 
       status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE offer_id = ?`,
      [offer_title, offer_description || null,
       discount_percent, valid_from || null, valid_to || null,
       status || 'active', offer_id]
    );

    res.json({
      success: true,
      message: 'Offer updated successfully'
    });

  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: error.message
    });
  }
};

// Delete Offer
const deleteOffer = async (req, res) => {
  try {
    const { offer_id } = req.params;

    // Check if offer exists
    const [existingOffer] = await db.execute(
      'SELECT * FROM product_offers WHERE offer_id = ?',
      [offer_id]
    );

    if (existingOffer.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Delete offer
    await db.execute('DELETE FROM product_offers WHERE offer_id = ?', [offer_id]);

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });

  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting offer',
      error: error.message
    });
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  getActiveOffers,
  getOfferById,
  getOffersByProduct,
  updateOffer,
  deleteOffer
};
