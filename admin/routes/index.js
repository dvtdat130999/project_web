var express = require('express');
var router = express.Router();
const passport=require('passport');
var user = require('../databasemodel/users');
const bcrypt=require('bcryptjs');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const {ensureAuthenticated}=require('../config/auth');

/* GET home page. */
router.get('/',ensureAuthenticated, (req, res, next) =>{
  productController.getIndex(req,res,next);
});
/* GET customer account page. */
router.get('/account',ensureAuthenticated, (req, res, next) =>{
  userController.getAccountList(req,res,next);
});



/* get logout*/
router.get('/logout',ensureAuthenticated, (req, res, next) =>{
  userController.getLogout(req,res,next);
});
/* GET shop list page. */
router.get('/shop',ensureAuthenticated, function(req, res, next) {
  res.render('shop', { userdata:req.user });
});
/* GET login page. */
router.get('/login', (req, res, next) =>{
  userController.getLogin(req,res,next);
});

router.post('/login', function(req, res, next) {

  userController.postLogin(req,res,next);

});
/* GET register page. */
router.get('/register', ensureAuthenticated,(req, res, next)=> {

  userController.getRegister(req,res,next);

});
router.post('/register',ensureAuthenticated, function(req, res, next) {
  userController.postRegister(req,res,next);


});
/* GET forget password page. */
router.get('/forget',(req, res, next)=> {

  userController.getForget(req,res,next);

});
router.post('/forget',(req, res, next)=> {

  userController.postForget(req,res,next);

});
/* GET lock account page. */
router.get('/locked_account',ensureAuthenticated,(req, res, next)=> {

  userController.getLocked(req,res,next);

});
router.post('/locked_account',ensureAuthenticated,(req, res, next)=> {

  userController.postLocked(req,res,next);

});
/* GET unlock account page. */
router.get('/unlocked_account',ensureAuthenticated,(req, res, next)=> {

  userController.getUnLocked(req,res,next);

});
router.post('/unlocked_account',ensureAuthenticated,(req, res, next)=> {

  userController.postUnLocked(req,res,next);

});


/* GET product list of shop page. */
router.get('/products',ensureAuthenticated, function(req, res, next) {
  res.render('products', { userdata:req.user });
});

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
