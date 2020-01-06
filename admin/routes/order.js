var express = require('express');
var router = express.Router();
const productController = require('../controller/productController');
const orderController = require('../controller/orderController');
const {ensureAuthenticated}=require('../config/auth');

router.get('/', ensureAuthenticated, orderController.getOrder);

module.exports = router;