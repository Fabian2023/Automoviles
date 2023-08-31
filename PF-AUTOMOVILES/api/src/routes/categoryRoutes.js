const express = require('express');
const CategoryController = require('../controllers/categoryController'); 

const router = express.Router();

router.get('/category', CategoryController.getAll);


module.exports = router;