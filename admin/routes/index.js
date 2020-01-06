var express = require('express');
var router = express.Router();
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const mainController = require('../controller/mainController');
const {ensureAuthenticated}=require('../config/auth');

/* GET home page. */
router.get('/', ensureAuthenticated, mainController.getIndex);

/* GET customer account page. */

/* GET shop list page. */
router.get('/shop', ensureAuthenticated, userController.getShop);

module.exports = router;
