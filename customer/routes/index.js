var express = require('express');
var router = express.Router();
var product = require('../databasemodel/products');
const productService = require('../models/productService');
const mongoose = require('mongoose');
const passport=require('passport');
var user = require('../databasemodel/users');
var popupTools = require('popup-tools');
const bcrypt=require('bcryptjs');
const {ensureAuthenticated}=require('../config/auth');

var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { nameuser:req.user });

});

/* get login page*/
router.get('/login', function(req, res, next) {
  res.render('login', );
});

router.post('/login', function(req, res, next) {

    passport.authenticate('local', { //chọn phương thức check là local => npm install passport-local
        failureRedirect: '/login',  //nếu check không đúng thì redirect về link này
        successRedirect: '/',
        failureFlash:true
    })(req,res,next);
});
/* get logout*/
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');

});
/* get register page*/
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.post('/register', function(req, res, next) {
    const{username,password,password2,name,address,phone,email}=req.body;
    let errors=[];

    //Check require field
    if(!name || !email || !username|| !password||!address||!phone || !password2)
    {
        errors.push({msg:"Hãy nhập tất cả thông tin"});
    }

    //Check password
    if(password!=password2)
    {
        errors.push({msg:"Mật khẩu nhập lại sai"});

    }

    //Check pass length
    if(password.length<6)
    {
        errors.push({msg:"Mật khẩu phải ít nhất 6 ký tự"});

    }



    if(errors.length>0)
    {
        res.render('register',{
            errors,
            username,
            password,
            password2,
            name,
            address,

            phone,
            email
        });
    }
    else {
        //Check username and email existed

        user.findOne({ username: username })
            .then(data =>{
                if(data)
                {
                    errors.push({msg:"Tài khoản đã tồn tại"});

                    res.render('register',{

                        errors,
                        username,
                        password,
                        password2,
                        name,
                        address,

                        phone,
                        email
                    });
                }
                else
                {
                    user.findOne({ email: email })
                        .then(data2=>{
                            if(data2)
                            {
                                errors.push({msg:"Email đã sử dụng"});

                                res.render('register',{

                                    errors,
                                    username,
                                    password,
                                    password2,
                                    name,
                                    address,

                                    phone,
                                    email
                                });
                            }
                            else
                            {
                                const newUser = new user({
                                    username,
                                    password,
                                    name,
                                    address,

                                    phone,
                                    email
                                });

                                //Hash password
                                bcrypt.genSalt(10,(err,salt)=>
                                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                                    if(err) throw  err;
                                    //Set password to hashed
                                    newUser.password=hash;
                                    newUser.save();
                                    req.flash('success_msg','Bạn đã đăng ký thành công');
                                    res.redirect('/');
                                }));


                            }

                        });

                }

            });






        }


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
