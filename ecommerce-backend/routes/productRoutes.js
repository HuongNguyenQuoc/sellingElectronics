const express = require('express');
const router = express.Router();
const { createProduct,
        getProducts,
        getProductById,
        updateProduct,
        deleteProduct
 } = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;