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
const nodemailer=require('nodemailer');
const randomstring=require('randomstring');

var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { userdata:req.user });

});

/* get login page*/
router.get('/login', function(req, res, next) {
  res.render('login',{ userdata:req.user } );
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
/* get verify page*/
router.get('/verify', function(req, res, next) {
    res.render('verify',{ userdata:req.user } );


});

router.post('/verify', async(req, res, next) =>{
    const{secretToken}=req.body;
    const newUser=await user.findOne({secretToken:secretToken});
    if(!newUser)
    {
        req.flash('error_msg','Không tìm được tài khoản thích hợp với mã');
        res.redirect('/verify');
        return;
    }
    newUser.active=true;
    newUser.secretToken='';
    await newUser.save();
    req.flash('success_msg','Kích hoạt thành công, bạn có thể đăng nhập');
    res.redirect('/verify');




});


/* get register page*/
router.post('/register', function(req, res, next) {
  res.render('register',{ userdata:req.user });
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

                                    //secret token for verify
                                    newUser.secretToken=randomstring.generate();

                                    newUser.save();

                                    //send mail for verify
                                    var transporter =  nodemailer.createTransport({ // config mail server
                                        service: 'gmail',
                                        auth: {
                                            user: 'tdat130999@gmail.com',
                                            pass: 'Dvtdat130999'
                                        }
                                    });
                                    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                                        from: 'Admin project shop',
                                        to: newUser.email,
                                        subject: 'Kích hoạt tài khoản',
                                        html: 'Chào '+newUser.name+'<br>'
                                            +'Bạn cần nhập mã sau: '+newUser.secretToken+'<br>'
                                            +'ở trang: '+'<a href="http://localhost:3000/verify">http://localhost:3000/verify</a>'
                                    }
                                    transporter.sendMail(mainOptions, function(error, info) {
                                        if (error) { // nếu có lỗi
                                            console.log(error);
                                        } else { //nếu thành công
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                    req.flash('success_msg','Bạn đã đăng ký thành công, hãy vào email để kích hoạt tài khoản');
                                    res.redirect('/register');

                                }));


                            }

                        });

                }

            });






        }


});
/* get forget_password page*/
router.get('/forget', function(req, res, next) {
  res.render('forget_password', { userdata:req.user });
});

router.post('/forget', async(req, res, next) =>{
    const{username,email}=req.body;

    const newUser=await user.findOne({username:username,email:email});
    if(!newUser)
    {
        req.flash('error_msg','Sai tài khoản hoặc email');
        res.redirect('/forget');
        return;
    }
    else
    {
        const newPassword=randomstring.generate();
        newUser.password=newPassword;
        //send mail for verify
        var transporter =  nodemailer.createTransport({ // config mail server
            service: 'gmail',
            auth: {
                user: 'tdat130999@gmail.com',
                pass: 'Dvtdat130999'
            }
        });
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Admin project shop',
            to: newUser.email,
            subject: 'Tạo mật khẩu mới',
            html: 'Chào '+newUser.name+'<br>'
                +'Mật khẩu mới của bạn là: '+newUser.password+'<br>'

        }
        transporter.sendMail(mainOptions, function(error, info) {
            if (error) { // nếu có lỗi
                console.log(error);
            } else { //nếu thành công
                console.log('Email sent: ' + info.response);
            }
        });

        //Hash password
        await bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw  err;
                //Set password to hashed
                newUser.password = hash;

                console.log(hash);
                newUser.save();


                req.flash('success_msg', 'Tạo mật khẩu mới thành công, vào email để xem kết quả');
                res.redirect('/forget');

            }));
    }

});

/* get change_password page*/
router.get('/change_password',ensureAuthenticated, function(req, res, next) {
    res.render('change_password', { userdata:req.user });
});

router.post('/change_password', async(req, res, next) =>{
    const{password1,password2}=req.body;
    const newUser=await user.findOne({username:req.user.username});

    await bcrypt.compare(password1,newUser.password,(err,isMatch)=>{
        if(err) throw  err;
        if(isMatch)
        {
            //Hash password
             bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(password2, salt, (err, hash) => {
                    if (err) throw  err;
                    //Set password to hashed
                    newUser.password = hash;

                    newUser.save();


                    req.flash('success_msg', 'Tạo mật khẩu mới thành công, hãy thoát ra và đăng nhập lại để kiểm tra');
                    res.redirect('/change_password');

                }));
        }
        else
        {

            req.flash('error_msg', 'Sai mật khẩu cũ');
            res.redirect('/change_password');
        }
    });




});

/* get cart page*/
router.get('/cart', function(req, res, next) {
  res.render('cart', { userdata:req.user });
});

/* get my account page*/
router.get('/account', function(req, res, next) {
  res.render('my_account', { userdata:req.user });
});

/* get ship information page*/
router.get('/ship', function(req, res, next) {
  res.render('ship', { userdata:req.user });
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
                    res.render('products/productdetail', { title: 'Diamond ring 2', product_list: list_products ,userdata:req.user});
                });
        }
        else
        {
            productService.findByCategory(category)
                .exec(function (err, list_products) {
                    if (err) { return next(err); }
                    //Successful, so render
                    res.render('products/list', { title: 'Watch List', product_list: list_products,userdata:req.user});
                });
        }
    }
    else
    {
        product.find()
            .exec(function (err, list_products) {
                if (err) { return next(err); }
                //Successful, so render
                res.render('products/list', { product_list: list_products,userdata:req.user });
            });
    }
});

/* get product status page*/
router.get('/status', function(req, res, next) {
  res.render('status_products', {userdata:req.user});
});

/* get advanced searching page*/
router.get('/advanced', function(req, res, next) {
  res.render('advanced_searching',{userdata:req.user});
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
