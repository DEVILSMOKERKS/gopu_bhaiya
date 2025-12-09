const express = require('express');
const router = express.Router();
const productAttributeController = require('../controllers/productAttributeController');
const authenticateToken = require('../middleware/auth');

// Get all attributes for a product (Public)
router.get('/product/:product_id', productAttributeController.getProductAttributes);

// Get single attribute (Admin)
router.get('/:attribute_id', authenticateToken, productAttributeController.getAttributeById);

// Create single attribute (Admin)
router.post('/', authenticateToken, productAttributeController.createAttribute);

// Create multiple attributes (Admin)
router.post('/bulk', authenticateToken, productAttributeController.createMultipleAttributes);

// Update single attribute (Admin)
router.put('/:attribute_id', authenticateToken, productAttributeController.updateAttribute);

// Update multiple attributes (Admin)
router.put('/bulk/update', authenticateToken, productAttributeController.updateMultipleAttributes);

// Delete single attribute (Admin)
router.delete('/:attribute_id', authenticateToken, productAttributeController.deleteAttribute);

// Delete all attributes for a product (Admin)
router.delete('/product/:product_id', authenticateToken, productAttributeController.deleteProductAttributes);

module.exports = router;

