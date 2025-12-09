const express = require('express');
const router = express.Router();
const expertConsultationController = require('../controllers/expertConsultationController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/expert-consultation', expertConsultationController.createExpertConsultation);

// Admin routes (authentication required)
router.get('/admin/expert-consultations', authenticateAdmin, expertConsultationController.getAllExpertConsultations);
router.get('/admin/expert-consultations/:id', authenticateAdmin, expertConsultationController.getExpertConsultationById);
router.put('/admin/expert-consultations/:id/status', authenticateAdmin, expertConsultationController.updateExpertConsultationStatus);
router.delete('/admin/expert-consultations/:id', authenticateAdmin, expertConsultationController.deleteExpertConsultation);
router.get('/admin/expert-consultation-statistics', authenticateAdmin, expertConsultationController.getExpertConsultationStatistics);

module.exports = router;

