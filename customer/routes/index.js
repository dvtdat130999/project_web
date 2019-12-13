var express = require('express');
var router = express.Router();
const {ensureAuthenticated}=require('../config/auth');

const productController = require('../controller/productController')
const userController = require('../controller/userController')

var async = require('async');

/* GET home page. */
router.get('/', (req, res, next) => productController.getIndex(req, res, next));

/* get login page*/
router.get('/login', (req, res, next) => userController.getLogin(req, res, next));

router.post('/login', (req, res, next) => userController.postLogin(req, res, next));

/* get logout*/
router.get('/logout', (req, res, next) => userController.getLogout(req, res, next));

/* get verify page*/
router.get('/verify', (req, res, next) => userController.getVerify(req, res, next));

router.post('/verify', async(req, res, next) => await userController.postVerify(req, res, next));

/* get register page*/
router.get('/register', (req, res, next) => userController.getRegister(req, res, next));

router.post('/register', (req, res, next) => userController.postRegister(req, res, next));

/* get forget_password page*/
router.get('/forget', (req, res, next) => userController.getForget(req, res, next));

router.post('/forget', async(req, res, next) => await userController.postForget(req, res, next));

/* get change_password page*/
router.get('/change_password', ensureAuthenticated, function(req, res, next) {
    res.render('change_password', { userdata:req.user });
});

router.post('/change_password', async(req, res, next) => userController.postChangePassword(req, res, next));

/* get cart page*/
router.get('/cart', (req, res, next) => productController.getCart(req, res, next));

/* get my account page*/
router.get('/account', (req, res, next) => userController.getAccount(req, res, next));

/* get ship information page*/
router.get('/ship', (req, res, next) => productController.getShip(req, res, next));

/// PRODUCT ROUTES ///

// GET request for list of all Product.
router.get('/products', (req, res, next) => productController.getProduct(req, res, next));

/* get product status page*/
router.get('/status', (req, res, next) => productController.getStatus(req, res, next));

/* get advanced searching page*/
router.get('/advanced', (req, res, next) => productController.getAdvanced(req, res, next));

module.exports = router;
