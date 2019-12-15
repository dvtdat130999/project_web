var express = require('express');
var router = express.Router();

const {ensureAuthenticated}=require('../config/auth');
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/', userController.getLogin);
/* get login page*/

//router.get('/login', userController.getLogin);
router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

/* get logout*/
router.get('/logout', userController.getLogout);

/* get verify page*/
router.get('/verify', userController.getVerify);

router.post('/verify', userController.postVerify);

/* get register page*/
router.get('/register', userController.getRegister);

router.post('/register', userController.postRegister);

/* get forget_password page*/
router.get('/forget', userController.getForget);

router.post('/forget', userController.postForget);

/* get change_password page*/
router.get('/change_password', ensureAuthenticated, function(req, res, next) {
  res.render('change_password', { userdata:req.user });
});

router.post('/change_password', userController.postChangePassword);

router.get('/account', userController.getAccount);
router.post('/account', userController.postAccount);

module.exports = router;
