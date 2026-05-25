const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productController');

// Route to create a new product
router.post('/', createProduct);

module.exports = router;