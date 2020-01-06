var express = require('express');
var router = express.Router();
const {ensureAuthenticated}=require('../config/auth');
const util = require('util');
const saleController = require('../controller/saleController')

router.get('/',ensureAuthenticated, saleController.getIndex);

module.exports = router;