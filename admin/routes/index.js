var express = require('express');
var router = express.Router();
const passport=require('passport');
var user = require('../databasemodel/users');
const bcrypt=require('bcryptjs');

const {ensureAuthenticated}=require('../config/auth');

/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
  res.render('index', { userdata:req.user });
});
/* GET customer account page. */
router.get('/account',ensureAuthenticated, function(req, res, next) {
  res.render('customer_account', { userdata:req.user });
});
/* get logout*/
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');

});
/* GET shop list page. */
router.get('/shop',ensureAuthenticated, function(req, res, next) {
  res.render('shop', { userdata:req.user });
});
/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/login', function(req, res, next) {

  passport.authenticate('local', { //chọn phương thức check là local => npm install passport-local
    failureRedirect: '/login',  //nếu check không đúng thì redirect về link này
    successRedirect: '/',
    failureFlash:true
  })(req,res,next);
});
/* GET register page. */
router.get('/register',ensureAuthenticated, function(req, res, next) {
  res.render('register', { userdata:req.user });


});
/* GET forget password page. */
router.get('/forget', function(req, res, next) {
  res.render('forget_password', { userdata:req.user });
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
                      email,

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
