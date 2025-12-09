const db = require('../config/db');
const { sendEmail } = require('../utils/emailSender');

// Create a new expert consultation request
const createExpertConsultation = async (req, res) => {
  try {
    const { fullName, email, phone, city, aboutYourself } = req.body;

    // Validation
    if (!fullName || !email || !city || !aboutYourself) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
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

    // Validate aboutYourself enum
    if (!['homeowner', 'designer'].includes(aboutYourself)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for about yourself field'
      });
    }

    // Insert consultation into database
    const [result] = await db.execute(
      'INSERT INTO expert_consultations (full_name, email, phone, city, about_yourself) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, phone || null, city, aboutYourself]
    );

    // Send confirmation email to user
    try {
      await sendEmail(email, 'consultationConfirmation', {
        name: fullName,
        city,
        aboutYourself
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
      if (adminEmails.length > 0) {
        await sendEmail(adminEmails.join(','), 'consultationNotification', {
          name: fullName,
          email,
          phone: phone || 'Not provided',
          city,
          aboutYourself,
          consultationId: result.insertId
        });
      }
    } catch (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError);
      // Don't fail the request if admin email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your consultation request has been submitted successfully. Our expert will contact you soon!',
      consultationId: result.insertId
    });

  } catch (error) {
    console.error('Error creating expert consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit consultation request. Please try again later.'
    });
  }
};

// Get all expert consultations (admin only)
const getAllExpertConsultations = async (req, res) => {
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
      whereClause += `${searchWhere} (full_name LIKE ? OR email LIKE ? OR city LIKE ? OR phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM expert_consultations ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get consultations with pagination
    const [consultations] = await db.execute(
      `SELECT 
        ec.*,
        a.name as admin_name
       FROM expert_consultations ec
       LEFT JOIN admins a ON ec.contacted_by = a.id
       ${whereClause}
       ORDER BY ec.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: consultations,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('Error fetching expert consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expert consultations'
    });
  }
};

// Get single expert consultation by ID
const getExpertConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [consultations] = await db.execute(
      `SELECT 
        ec.*,
        a.name as admin_name
       FROM expert_consultations ec
       LEFT JOIN admins a ON ec.contacted_by = a.id
       WHERE ec.id = ?`,
      [id]
    );

    if (consultations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expert consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultations[0]
    });

  } catch (error) {
    console.error('Error fetching expert consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expert consultation'
    });
  }
};

// Update expert consultation status (admin only)
const updateExpertConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const adminId = req.admin.id; // From auth middleware

    // Validation
    if (!status || !['pending', 'contacted', 'in_progress', 'completed', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, contacted, in_progress, completed, closed'
      });
    }

    // Check if consultation exists
    const [existingConsultation] = await db.execute(
      'SELECT * FROM expert_consultations WHERE id = ?',
      [id]
    );

    if (existingConsultation.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expert consultation not found'
      });
    }

    // Update consultation
    const updateData = {
      status,
      admin_notes: admin_notes || null,
      contacted_by: ['contacted', 'in_progress', 'completed'].includes(status) ? adminId : null,
      contacted_at: ['contacted', 'in_progress', 'completed'].includes(status) && !existingConsultation[0].contacted_at ? new Date() : existingConsultation[0].contacted_at
    };

    await db.execute(
      `UPDATE expert_consultations 
       SET status = ?, admin_notes = ?, contacted_by = ?, contacted_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updateData.status, updateData.admin_notes, updateData.contacted_by, updateData.contacted_at, id]
    );

    // Send status update email to user if status changed
    if (existingConsultation[0].status !== status) {
      try {
        await sendEmail(existingConsultation[0].email, 'consultationStatusUpdate', {
          name: existingConsultation[0].full_name,
          oldStatus: existingConsultation[0].status,
          newStatus: status,
          adminNotes: admin_notes
        });
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Expert consultation status updated successfully'
    });

  } catch (error) {
    console.error('Error updating expert consultation status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expert consultation status'
    });
  }
};

// Delete expert consultation (admin only)
const deleteExpertConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if consultation exists
    const [existingConsultation] = await db.execute(
      'SELECT * FROM expert_consultations WHERE id = ?',
      [id]
    );

    if (existingConsultation.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expert consultation not found'
      });
    }

    // Delete consultation
    await db.execute(
      'DELETE FROM expert_consultations WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Expert consultation deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting expert consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expert consultation'
    });
  }
};

// Get expert consultation statistics (admin only)
const getExpertConsultationStatistics = async (req, res) => {
  try {
    // Get counts by status
    const [statusCounts] = await db.execute(
      `SELECT 
        status,
        COUNT(*) as count
       FROM expert_consultations
       GROUP BY status`
    );

    // Get total count
    const [totalResult] = await db.execute(
      'SELECT COUNT(*) as total FROM expert_consultations'
    );

    // Get today's count
    const [todayResult] = await db.execute(
      'SELECT COUNT(*) as today FROM expert_consultations WHERE DATE(created_at) = CURDATE()'
    );

    // Get this week's count
    const [weekResult] = await db.execute(
      'SELECT COUNT(*) as week FROM expert_consultations WHERE YEARWEEK(created_at) = YEARWEEK(NOW())'
    );

    // Get this month's count
    const [monthResult] = await db.execute(
      'SELECT COUNT(*) as month FROM expert_consultations WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())'
    );

    // Get counts by about_yourself
    const [aboutCounts] = await db.execute(
      `SELECT 
        about_yourself,
        COUNT(*) as count
       FROM expert_consultations
       GROUP BY about_yourself`
    );

    const stats = {
      total: totalResult[0].total,
      today: todayResult[0].today,
      thisWeek: weekResult[0].week,
      thisMonth: monthResult[0].month,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {}),
      byType: aboutCounts.reduce((acc, item) => {
        acc[item.about_yourself] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching expert consultation statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expert consultation statistics'
    });
  }
};

module.exports = {
  createExpertConsultation,
  getAllExpertConsultations,
  getExpertConsultationById,
  updateExpertConsultationStatus,
  deleteExpertConsultation,
  getExpertConsultationStatistics
};

