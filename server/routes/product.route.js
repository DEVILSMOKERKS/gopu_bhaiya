const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const  authenticateToken  = require('../middleware/auth');
const { upload } = require('../middleware/multer');

// Public routes (no authentication required) – specific paths before :product_id
router.get('/', productController.getAllProducts);
router.get('/bestsellers', productController.getBestsellerProducts);
router.get('/new-arrivals', productController.getNewArrivalProducts);
router.get('/also-like', productController.getAlsoLikeProducts);
router.get('/category/:category_id', productController.getProductsByCategory);
router.get('/subcategory/:subcategory_id', productController.getProductsBySubcategory);
router.get('/:categorySlug/:productSlug', productController.getProductByCategoryAndProductSlug);
router.get('/:product_id', productController.getProductById);

// Protected routes (admin authentication required)
router.post('/',
    authenticateToken,
    upload.array('images', 10, '/products'),
    productController.createProduct
);
router.put('/:product_id', authenticateToken, upload.array('images', 10, '/products'), productController.updateProduct);
router.delete('/:product_id', authenticateToken, productController.deleteProduct);

module.exports = router;
