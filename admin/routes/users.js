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

module.exports = router;
