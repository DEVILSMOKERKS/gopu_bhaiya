const db = require('../config/db');
const { sendEmail } = require('../utils/emailSender');

// Create a new contact query
const createContactQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Phone validation (basic)
    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
    }

    // Insert query into database
    const [result] = await db.execute(
      'INSERT INTO contact_queries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, message]
    );

    // Send confirmation email to user
    try {
      await sendEmail(email, 'contactConfirmation', {
        name,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
      if (adminEmails.length > 0) {
        await sendEmail(adminEmails.join(','), 'contactNotification', {
          name,
          email,
          phone,
          subject,
          message,
          queryId: result.insertId
        });
      }
    } catch (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError);
      // Don't fail the request if admin email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      queryId: result.insertId
    });

  } catch (error) {
    console.error('Error creating contact query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

// Get all contact queries (admin only)
const getAllContactQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = '';
    let params = [];

    if (status && status !== 'all') {
      whereClause += 'WHERE status = ?';
      params.push(status);
    }

    if (search) {
      const searchWhere = whereClause ? 'AND' : 'WHERE';
      whereClause += `${searchWhere} (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM contact_queries ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get queries with pagination
    const [queries] = await db.execute(
      `SELECT 
        cq.*,
        a.name as admin_name
       FROM contact_queries cq
       LEFT JOIN admins a ON cq.resolved_by = a.id
       ${whereClause}
       ORDER BY cq.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: queries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('Error fetching contact queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact queries'
    });
  }
};

// Get single contact query by ID
const getContactQueryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [queries] = await db.execute(
      `SELECT 
        cq.*,
        a.name as admin_name
       FROM contact_queries cq
       LEFT JOIN admins a ON cq.resolved_by = a.id
       WHERE cq.id = ?`,
      [id]
    );

    if (queries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }

    res.json({
      success: true,
      data: queries[0]
    });

  } catch (error) {
    console.error('Error fetching contact query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact query'
    });
  }
};

// Update contact query status (admin only)
const updateContactQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const adminId = req.admin.id; // From auth middleware

    // Validation
    if (!status || !['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in_progress, resolved, closed'
      });
    }

    // Check if query exists
    const [existingQuery] = await db.execute(
      'SELECT * FROM contact_queries WHERE id = ?',
      [id]
    );

    if (existingQuery.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }

    // Update query
    const updateData = {
      status,
      admin_notes: admin_notes || null,
      resolved_by: status === 'resolved' ? adminId : null,
      resolved_at: status === 'resolved' ? new Date() : null
    };

    await db.execute(
      `UPDATE contact_queries 
       SET status = ?, admin_notes = ?, resolved_by = ?, resolved_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updateData.status, updateData.admin_notes, updateData.resolved_by, updateData.resolved_at, id]
    );

    // Send status update email to user if status changed
    if (existingQuery[0].status !== status) {
      try {
        await sendEmail(existingQuery[0].email, 'contactStatusUpdate', {
          name: existingQuery[0].name,
          subject: existingQuery[0].subject,
          oldStatus: existingQuery[0].status,
          newStatus: status,
          adminNotes: admin_notes
        });
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Contact query status updated successfully'
    });

  } catch (error) {
    console.error('Error updating contact query status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact query status'
    });
  }
};

// Delete contact query (admin only)
const deleteContactQuery = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if query exists
    const [existingQuery] = await db.execute(
      'SELECT * FROM contact_queries WHERE id = ?',
      [id]
    );

    if (existingQuery.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found'
      });
    }

    // Delete query
    await db.execute(
      'DELETE FROM contact_queries WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Contact query deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact query'
    });
  }
};

// Get contact statistics (admin only)
const getContactStatistics = async (req, res) => {
  try {
    // Get counts by status
    const [statusCounts] = await db.execute(
      `SELECT 
        status,
        COUNT(*) as count
       FROM contact_queries
       GROUP BY status`
    );

    // Get total count
    const [totalResult] = await db.execute(
      'SELECT COUNT(*) as total FROM contact_queries'
    );

    // Get today's count
    const [todayResult] = await db.execute(
      'SELECT COUNT(*) as today FROM contact_queries WHERE DATE(created_at) = CURDATE()'
    );

    // Get this week's count
    const [weekResult] = await db.execute(
      'SELECT COUNT(*) as week FROM contact_queries WHERE YEARWEEK(created_at) = YEARWEEK(NOW())'
    );

    // Get this month's count
    const [monthResult] = await db.execute(
      'SELECT COUNT(*) as month FROM contact_queries WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())'
    );

    const stats = {
      total: totalResult[0].total,
      today: todayResult[0].today,
      thisWeek: weekResult[0].week,
      thisMonth: monthResult[0].month,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching contact statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
};

module.exports = {
  createContactQuery,
  getAllContactQueries,
  getContactQueryById,
  updateContactQueryStatus,
  deleteContactQuery,
  getContactStatistics
};
