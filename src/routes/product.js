const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

router.get('/', productController.showProductList)
router.get('/:gender', productController.filterGender)
router.get('/detail/:id/:sku/:size', productController.showProductDetail);
router.post('/detail/:id/:sku/:size', productController.postComment)


module.exports = router;