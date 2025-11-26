const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/contact-us', contactController.createContactQuery);

// Admin routes (authentication required)
router.get('/admin/contact-queries', authenticateAdmin, contactController.getAllContactQueries);
router.get('/admin/contact-queries/:id', authenticateAdmin, contactController.getContactQueryById);
router.put('/admin/contact-queries/:id/status', authenticateAdmin, contactController.updateContactQueryStatus);
router.delete('/admin/contact-queries/:id', authenticateAdmin, contactController.deleteContactQuery);
router.get('/admin/contact-statistics', authenticateAdmin, contactController.getContactStatistics);

module.exports = router;
