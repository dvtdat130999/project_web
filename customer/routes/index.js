var express = require('express');
var router = express.Router();
var product = require('../databasemodel/products');
const productService = require('../models/productService');

var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

/// PRODUCT ROUTES ///

// GET request for list of all Product.
router.get('/products',  function(req, res, next){
    const category = req.query.category;
    if(typeof category !== "undefined")
    {
        const id = req.query.id;
        if(typeof id !== "undefined")
        {
            productService.findById(id)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/productdetail', { title: 'Diamond ring 2', product_list: list_products });
                });
        }
        else
        {
            productService.findByCategory(category)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/list', { title: 'Watch List', product_list: list_products });
                });
        }
    }
    else
    {
        product.find()
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                res.render('products/list', { product_list: list_products });
            });
    }
});

/* get product status page*/
router.get('/status', function(req, res, next) {
  res.render('status_products', { title: 'Express' });
});

/* get advanced searching page*/
router.get('/advanced', function(req, res, next) {
  res.render('advanced_searching', { title: 'Express' });
});

//insert product
router.post('/insert_new_product', function(req, res, next) {
  const newProduct=new product({
      name:'Nhẫn lam ngọc',
      price:30000000,
      description:"Nhẫn lam ngọc đẹp, quý phái",
      thumbnail: 'assets/img/j.jpg',
      category:3,
  });
  newProduct.save((err)=>{
    if(err)
    {
      res.json({
        result:'failed',
        data:{},
        message:'Error is: ${err}'
      });

    }else{
      res.json({
        result:'ok',
        data:{
            name:'Nhẫn lam ngọc',
            price:20000000,
            description:"Nhẫn lam ngọc đẹp, quý phái",
            thumbnail: 'assets/img/j.jpg',
            category:3,
            message:'Insert new product successfully'
        }
      });
    }
  })
});

module.exports = router;
