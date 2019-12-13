const product = require('../databasemodel/products');
const productService = require('../models/productService');
var async = require('async');

exports.getIndex = (req, res, next) =>  res.render('index', { userdata:req.user });



////////////////////////////////////////////////////////////////////////////