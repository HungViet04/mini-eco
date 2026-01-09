const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Public APIs
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Admin only
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    productController.createProduct
);

module.exports = router;
