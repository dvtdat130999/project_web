var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET customer account page. */
router.get('/account', function(req, res, next) {
  res.render('customer_account', { title: 'Express' });
});
/* GET shop list page. */
router.get('/shop', function(req, res, next) {
  res.render('shop', { title: 'Express' });
});

/* GET product list of shop page. */
router.get('/products', function(req, res, next) {
  res.render('products', { title: 'Express' });
});

/* GET sales page. */
router.get('/sales', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});

router.get('/sales_year', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});

router.get('/sales_month', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});

router.get('/sales_week', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});
/* GET top-selling page. */
router.get('/top_necklace', function(req, res, next) {
  res.render('top_selling_necklace', { title: 'Express' });
});

/* GET top-selling ring page. */
router.get('/top_ring', function(req, res, next) {
  res.render('top_selling_ring', { title: 'Express' });
});

/* GET ring list page. */
router.get('/ring', function(req, res, next) {
  res.render('ring', { title: 'Express' });
});

/* GET bracelet list page. */
router.get('/necklace', function(req, res, next) {
  res.render('necklace', { title: 'Express' });
});

/* GET bill list page. */
router.get('/bill', function(req, res, next) {
  res.render('bill', { title: 'Express' });
});
module.exports = router;
