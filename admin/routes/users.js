var express = require('express');
var router = express.Router();
const passport=require('passport');
var user = require('../databasemodel/users');
const bcrypt=require('bcryptjs');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const {ensureAuthenticated}=require('../config/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/account', ensureAuthenticated, userController.getAccountList);
router.get('/my_account', ensureAuthenticated, userController.getMyAccount);

//change account information
router.get('/change_myaccount', ensureAuthenticated, userController.getChangeMyAccount);
router.post('/change_myaccount', ensureAuthenticated, userController.postChangeMyAccount);

/* get logout*/
router.get('/logout', ensureAuthenticated, userController.getLogout);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);
/* GET register page. */
router.get('/register', ensureAuthenticated, userController.getRegister);
router.post('/register', ensureAuthenticated, userController.postRegister);

/* GET forget password page. */
router.get('/forget', userController.getForget);

router.post('/forget', userController.postForget);

/* GET lock account page. */
router.get('/locked_account', ensureAuthenticated, userController.getLocked);

router.post('/locked_account', ensureAuthenticated, userController.postLocked);

/* GET unlock account page. */
router.get('/unlocked_account', ensureAuthenticated, userController.getUnLocked);

router.post('/unlocked_account', ensureAuthenticated, userController.postUnLocked);

module.exports = router;
