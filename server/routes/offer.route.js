const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authenticateToken = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', offerController.getAllOffers);
router.get('/active', offerController.getActiveOffers);
router.get('/:offer_id', offerController.getOfferById);
router.get('/product/:product_id', offerController.getOffersByProduct);

// Protected routes (admin authentication required)
router.post('/', authenticateToken, offerController.createOffer);
router.put('/:offer_id', authenticateToken, offerController.updateOffer);
router.delete('/:offer_id', authenticateToken, offerController.deleteOffer);

module.exports = router;
