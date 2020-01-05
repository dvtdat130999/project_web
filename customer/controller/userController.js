const passport = require('passport');
const userService = require('../models/userService');
const productService = require('../models/productService');
const user = require('../databasemodel/users');
const Cart=require('../databasemodel/cart');
var async = require('async');
const bcrypt=require('bcryptjs');
const randomstring=require('randomstring');
const nodemailer=require('nodemailer');

exports.getAccount = async (req, res, next) =>{
    let amount= await getAmount(req.user);
    res.render('my_account', { userdata: req.user, amountItem: amount });
};

exports.postAccount = async (req, res, next) => {
    const {name, address, phone} = req.body;

    const newUser = await userService.getUserByUsername(req.user.username);

    console.log("postpost" + name + address + phone);

    newUser.name = name;
    newUser.address = address;
    newUser.phone = phone;

    newUser.save();

    res.redirect('/users/account');
}

exports.getLogin = async (req, res, next) =>{
    let amount= await getAmount(req.user);
    res.render('login',{ userdata:req.user, msg: req.query.msg, amountItem:amount });
};

exports.getLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};

exports.getVerify = async (req, res, next) =>{
    let amount= await getAmount(req.user);
    res.render('verify',{ userdata:req.user, amountItem: amount });
};

exports.getRegister = async (req, res, next) =>{
    let amount= await getAmount(req.user);
    res.render('register',{ userdata:req.user, amountItem: amount });
};

exports.getForget = async (req, res, next) =>{
    let amount= await getAmount(req.user);
    res.render('forget_password', { userdata:req.user, amountItem: amount });
};

exports.postLogin = (req, res, next) => {
    //chọn phương thức check là local => npm install passport-local
    passport.authenticate('local',function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/users/login?msg=fail'); }   //nếu check không đúng thì redirect về link này
        req.logIn(user, async function(err) {
            if (err) { return next(err); }

            let stringItem=req.body.StringItem;
            if (stringItem!==null && stringItem.length>0)
            {
                let arrayItem=stringItem.split('-');
                arrayItem.shift();     //Loại bỏ phần tử đầu tiên

                let username=req.user.username;
                let cart = await productService.getCartOfUser(username);
                console.log(cart);
                if (cart.length===0)    //Giỏ hàng chưa tồn tại
                {
                    const newCart=new Cart({user:username, amount: arrayItem.length, listItem: arrayItem});
                    await newCart.save();

                }
                else
                {
                    //Gộp 2 giỏ hàng.
                    let idCart=cart[0]._id;
                    let arrayProduct=cart[0].listItem;
                    console.log(arrayProduct);
                    for (let i=0;i<arrayItem.length;i++)
                    {
                        arrayProduct.push(arrayItem[i]);
                    }
                    console.log(arrayProduct);
                    await Cart.updateOne({ _id: idCart },
                        {
                            amount: arrayProduct.length,
                            listItem: arrayProduct
                        });
                }
            }

            return res.redirect('/');
        });
    })(req, res, next);
};

exports.postVerify = async (req, res, next) => {
    const {secretToken} = req.body;
    const newUser = await userService.getUserBySecretToken(secretToken);
    if (!newUser) {
        req.flash('error_msg', 'Không tìm được tài khoản thích hợp với mã');
        res.redirect('/users/verify');
        return;
    }
    newUser.active = true;
    newUser.secretToken = '';
    await newUser.save();
    req.flash('success_msg', 'Kích hoạt thành công, bạn có thể đăng nhập');
    res.redirect('/users/login');
}

exports.postRegister = (req, res, next) => {
    const {username, password, password2, name, address, phone, email} = req.body;
    let errors = [];

    //Check require field
    if (!name || !email || !username || !password || !address || !phone || !password2)
        errors.push({msg: "Hãy nhập tất cả thông tin"});

    //Check password
    if (password != password2) {
        errors.push({msg: "Mật khẩu nhập lại sai"});
    }

    //Check pass length
    if (password.length < 6) {
        errors.push({msg: "Mật khẩu phải ít nhất 6 ký tự"});
    }

    if (errors.length > 0) {
        res.render('register', { errors, username, password, password2, name, address, phone, email });
    } else {
        //Check username and email existed
        userService.getUserByUsername(username)
            .then(data => {
                if (data) {
                    errors.push({msg: "Tài khoản đã tồn tại"});

                    res.render('/users/register', { errors, username, password, password2, name, address, phone, email });
                } else {
                    userService.getUserByEmail(email)
                        .then(data2 => {
                            if (data2) {
                                errors.push({msg: "Email đã sử dụng"});

                                res.render('register', { errors, username, password, password2, name, address, phone, email });
                            } else {
                                const uriDetail='/account?username='+username;
                                const newUser = new user({
                                    username,
                                    password,
                                    name,
                                    address,
                                    phone,
                                    email,
                                    uriDetail
                                });

                                //Hash password
                                userService.insertUser(newUser);
                                req.flash('success_msg', 'Bạn đã đăng ký thành công, hãy vào email để kích hoạt tài khoản');
                                res.redirect('/users/verify');
                            }
                        });
                }
            });
    }
};

exports.postForget = async (req, res, next) => {
    const{username,email}=req.body;

    const newUser = await userService.getUserByUsername(username);
    if(!newUser) {
        req.flash('error_msg', 'Sai tài khoản hoặc email');
        res.redirect('/users/forget');
        return;
    }
    else {
        const newPassword = randomstring.generate();
        newUser.password = newPassword;
        //send mail for verify
        var transporter = nodemailer.createTransport({ // config mail server
            service: 'gmail',
            auth: {
                user: 'projectweb1920@gmail.com',
                pass: 'webcuoiky1920'
            }
        });
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Admin project shop',
            to: newUser.email,
            subject: 'Tạo mật khẩu mới',
            html: 'Chào ' + newUser.name + '<br>'
                + 'Mật khẩu mới của bạn là: ' + newUser.password + '<br>'

        }
        transporter.sendMail(mainOptions, function (error, info) {
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
                res.redirect('/users/login');

            }));
    }
}

exports.postChangePassword = async (req, res, next) => {
    const{password1,password2}=req.body;

    const newUser = await userService.getUserByUsername(req.user.username);

    await bcrypt.compare(password1,newUser.password,(err,isMatch)=>{
        if(err) throw  err;
        if(isMatch) {
            //Hash password
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(password2, salt, (err, hash) => {
                    if (err) throw  err;
                    //Set password to hashed
                    newUser.password = hash;

                    newUser.save();

                    req.flash('success_msg', 'Tạo mật khẩu mới thành công, mời bạn đăng nhập lại');
                    req.logout();
                    res.redirect('/users/login');
                }));
        }
        else {
            req.flash('error_msg', 'Sai mật khẩu cũ');
            res.redirect('/users/change_password');
        }
    });
}

async function getAmount(user) {
    if (user)
    {
        let cart = await productService.getCartOfUser(user.username);
        if (cart.length>0)
        {
            return cart[0].amount;
        }
        else
        {
            return 0;
        }
    }
    return -1;
}