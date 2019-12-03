var express = require('express');
var router = express.Router();
const passport=require('passport');
var user = require('../databasemodel/users');
const bcrypt=require('bcryptjs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { nameuser:req.user });
});
/* GET customer account page. */
router.get('/account', function(req, res, next) {
  res.render('customer_account', { title: 'Express' });
});
/* get logout*/
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');

});
/* GET shop list page. */
router.get('/shop', function(req, res, next) {
  res.render('shop', { title: 'Express' });
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
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
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

/* GET product list of shop page. */
router.get('/products', function(req, res, next) {
  res.render('products', { title: 'Express' });
});

/* GET sales page. */
router.get('/sales', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});

router.get('/sales_year', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});

router.get('/sales_month', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});

router.get('/sales_week', function(req, res, next) {
  res.render('sales', { title: 'Express' });
});
/* GET top-selling page. */
router.get('/top_necklace', function(req, res, next) {
  res.render('top_selling_necklace', { title: 'Express' });
});

/* GET top-selling ring page. */
router.get('/top_ring', function(req, res, next) {
  res.render('top_selling_ring', { title: 'Express' });
});

/* GET ring list page. */
router.get('/ring', function(req, res, next) {
  res.render('ring', { title: 'Express' });
});

/* GET bracelet list page. */
router.get('/necklace', function(req, res, next) {
  res.render('necklace', { title: 'Express' });
});

/* GET bill list page. */
router.get('/bill', function(req, res, next) {
  res.render('bill', { title: 'Express' });
});
module.exports = router;
