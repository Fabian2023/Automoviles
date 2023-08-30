const express = require('express');
const ProductController = require('../controllers/productController'); 

const router = express.Router();

router.post('/product', ProductController.create);
router.put('/product/:id', ProductController.update);
// router.delete('/product/:id', ProductController.delete);
router.get('/product', ProductController.getAll);
router.get('/product/:id', ProductController.getById);

module.exports = router;