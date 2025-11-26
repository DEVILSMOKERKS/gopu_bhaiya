const express = require('express');
const router = express.Router();
const { subscribeNewsletter, getAllSubscribers, unsubscribeNewsletter, getNewsletterStatistics, sendNewsletter, deleteSubscriber } = require('../controllers/newsletterController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes
router.get('/subscribers', authenticateAdmin, getAllSubscribers);
router.get('/statistics', authenticateAdmin, getNewsletterStatistics);
router.post('/send', authenticateAdmin, sendNewsletter);
router.delete('/subscribers/:id', authenticateAdmin, deleteSubscriber);

module.exports = router;
