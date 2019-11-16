var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET product list page. */
router.get('/products', function(req, res, next) {
  res.render('products/list', { title: 'Express' });
});
/* get login page*/
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* get register page*/
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* get forget_password page*/
router.get('/forget', function(req, res, next) {
  res.render('forget_password', { title: 'Express' });
});
/* get cart page*/
router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Express' });
});

/* get my account page*/
router.get('/account', function(req, res, next) {
  res.render('my_account', { title: 'Express' });
});

/* get ship information page*/
router.get('/ship', function(req, res, next) {
  res.render('ship', { title: 'Express' });
});
/* get product watches page*/
router.get('/watch', function(req, res, next) {
  res.render('products/watch', { title: 'Express' });
});

/* get product jewel page*/
router.get('/jewel', function(req, res, next) {
  res.render('products/jewel', { title: 'Express' });
});


/* get product detail page*/
router.get('/detail', function(req, res, next) {
  res.render('products/detail', { title: 'Express' });
});

/* get product detail page*/
router.get('/status', function(req, res, next) {
  res.render('status_products', { title: 'Express' });
});

/* get advanced searching page*/
router.get('/advanced', function(req, res, next) {
  res.render('advanced_searching', { title: 'Express' });
});
module.exports = router;
