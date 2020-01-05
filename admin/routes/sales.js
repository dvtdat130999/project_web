var express = require('express');
var router = express.Router();
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const mainController = require('../controller/mainController');
const {ensureAuthenticated}=require('../config/auth');

router.get('/',ensureAuthenticated, function(req, res, next) {
    res.render('sales', { userdata:req.user, active:"sales" });
});

router.get('/year',ensureAuthenticated, function(req, res, next) {
    res.render('sales', { userdata:req.user, active:"sales" });
});

module.exports = router;