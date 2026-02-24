const { sendEmail } = require('../utils/emailSender');

/**
 * POST /api/book-appointment
 * Body: { name, email, contactNumber, city, appointmentType, selectedDate, selectedTime }
 * Sends confirmation to user and notification to admin.
 */
const createBookAppointment = async (req, res) => {
  try {
    const { name, email, contactNumber, city, appointmentType, selectedDate, selectedTime } = req.body;

    if (!name || !contactNumber || !city || !appointmentType || !selectedDate || !selectedTime) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: Full Name, Contact Number, City, appointment type, date and time.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const appointmentTypeLabel = appointmentType === 'store-tour'
      ? 'Store Tour (45 minutes)'
      : 'Temple Customization (1 hour 30 minutes)';

    const payload = {
      name: name.trim(),
      email: (email || '').trim(),
      contactNumber: (contactNumber || '').trim(),
      city: (city || '').trim(),
      appointmentType,
      appointmentTypeLabel,
      selectedDate,
      selectedTime
    };

    // Send confirmation to user (only if email provided)
    if (payload.email) {
      try {
        await sendEmail(payload.email, 'appointmentConfirmation', payload);
      } catch (emailError) {
        console.error('Book appointment: failed to send user confirmation:', emailError);
      }
    }

    // Send notification to admin
    try {
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()).filter(Boolean) : [];
      if (adminEmails.length > 0) {
        await sendEmail(adminEmails.join(','), 'appointmentNotification', payload);
      }
    } catch (adminEmailError) {
      console.error('Book appointment: failed to send admin notification:', adminEmailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your appointment request has been submitted. We will contact you soon to confirm.'
    });
  } catch (error) {
    console.error('Error in book appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit appointment. Please try again later.'
    });
  }
};

module.exports = {
  createBookAppointment
};
