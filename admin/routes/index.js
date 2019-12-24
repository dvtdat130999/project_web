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

/* GET product list of shop page. */

/* GET sales page. */
router.get('/sales',ensureAuthenticated, function(req, res, next) {
  res.render('sales', { userdata:req.user });
});

router.get('/sales_year',ensureAuthenticated, function(req, res, next) {
  res.render('sales', { userdata:req.user });
});

router.get('/sales_month',ensureAuthenticated, function(req, res, next) {
  res.render('sales', { userdata:req.user });
});

router.get('/sales_week',ensureAuthenticated, function(req, res, next) {
  res.render('sales', { userdata:req.user });
});
/* GET top-selling page. */
router.get('/top_necklace',ensureAuthenticated, function(req, res, next) {
  res.render('top_selling_necklace', { userdata:req.user });
});

/* GET top-selling ring page. */
router.get('/top_ring',ensureAuthenticated, function(req, res, next) {
  res.render('top_selling_ring', { userdata:req.user });
});

/* GET ring list page. */
router.get('/ring',ensureAuthenticated, function(req, res, next) {
  res.render('ring', { userdata:req.user });
});

/* GET bracelet list page. */
router.get('/necklace',ensureAuthenticated, function(req, res, next) {
  res.render('necklace', { userdata:req.user });
});

/* GET bill list page. */
router.get('/bill',ensureAuthenticated, function(req, res, next) {
  res.render('bill', { userdata:req.user });
});

module.exports = router;
