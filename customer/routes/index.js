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
router.get('/cart', productController.getCart);

router.post('/savecart',productController.saveCart);

/* get ship information page*/
router.get('/ship', productController.getShip);

/// PRODUCT ROUTES ///

// GET request for list of all Product.
router.get('/products', productController.getProduct);

//Post Comment to server
router.post('/products', productController.postComment);

//shoping
router.post('/products/shopping', productController.shopping);

/*post address delivery*/
router.post('/status', productController.postStatus);

/*get status my products*/
router.get('/status', productController.getStatus);

module.exports = router;
