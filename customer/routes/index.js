var express = require('express');
var router = express.Router();
const {ensureAuthenticated}=require('../config/auth');

const productController = require('../controller/productController');
const userController = require('../controller/userController');

var async = require('async');

/* GET home page. */
router.get('/', productController.getIndex);



/* get cart page - post list item*/
router.post('/cart', productController.getCart);

/* get ship information page*/
router.get('/ship', productController.getShip);

/// PRODUCT ROUTES ///

// GET request for list of all Product.
router.get('/products', productController.getProduct);

/* get product status page*/
router.get('/status', productController.getStatus);

module.exports = router;
