const passport = require('passport');
const userService = require('../models/userService');
const user = require('../databasemodel/users');
var async = require('async');
const bcrypt=require('bcryptjs');
const randomstring=require('randomstring');
const nodemailer=require('nodemailer');

exports.getAccountList = async (req, res, next) => {
    if (req.user.author !== "admin") {
        //Phân quyền nếu không phải là admin thì đá về trang chủ
        res.redirect('/');
    } else {
        const username = req.query.username;
        if (typeof username !== "undefined") {
            let accounts_customer;
            accounts_customer = await userService.getUserByUsername(username);

            res.render('detail_account', {
                title: 'List customer',
                account_list: accounts_customer,
                userdata: req.user
            });
        } else {
            const accounts_customer = await userService.getAccount(req.user.author);

            //Phan trang
            let page=req.query.page;
            let arr=[];
            let numberOfProduct=10;

            if (typeof page==="undefined"){
                page="1";
            }
            let index=parseInt(page,10)-1;
            let array2D = pageElementsArr(accounts_customer,numberOfProduct);

            for (i=0;i<array2D.length;i++)
            {
                arr[i]="";
            }
            arr[index]="class=active";
            if (typeof array2D[index]==="undefined")
            {
                array2D[index]=[];
            }

            res.render('customer_account', {
                account_list: array2D[index],
                userdata: req.user,
                active: "account", activePage: arr
            });
        }

    }
};

exports.getLogin = (req, res, next) => res.render('login',{ userdata:req.user });

exports.getLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};

exports.getVerify = (req, res, next) => res.render('verify',{ userdata:req.user });
exports.getMyAccount = (req, res, next) => res.render('my_account',{ userdata:req.user });
exports.getChangeMyAccount = (req, res, next) => res.render('change_myaccount',{ userdata:req.user });

exports.getRegister = (req, res, next) => res.render('register',{ userdata:req.user });

exports.getForget = (req, res, next) => res.render('forget_password', { userdata:req.user });

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', { //chọn phương thức check là local => npm install passport-local
        failureRedirect: '/users/login',  //nếu check không đúng thì redirect về link này
        successRedirect: '/',
        failureFlash: true
    })(req, res, next);
};

exports.postRegister = async (req, res, next) => {
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
        res.render('register', { errors, username, password, password2, name, address, phone, email,userdata:req.user });
    } else {
        //Check username and email existed
        const data = await userService.getUserByUsername(username);
        if (data) {
            errors.push({msg: "Tài khoản đã tồn tại"});
            res.render('register', { errors, username, password, password2, name, address, phone, email,userdata:req.user });
        } else {
            const data2 = await userService.getUserByEmail(email);
            if (data2) {
                errors.push({msg: "Email đã sử dụng"});

                res.render('register', {
                    errors,
                    username,
                    password,
                    password2,
                    name,
                    address,
                    phone,
                    email,
                    userdata: req.user
                });
            } else {
                const uriDetail = '/users/account?username=' + username;

                const linkproducts = "/";
                const newUser = new user({
                    username,
                    password,
                    name,
                    address,
                    phone,
                    email,
                    uriDetail,
                    linkproducts
                });

                newUser.linkproducts = "/products?shop=" + newUser.id;

                //Hash password
                userService.insertUser(newUser);
                req.flash('success_msg', 'Tạo tài khoản thành công');
                res.redirect('/users/register');
            }
        }
    }
};
exports.postChangeMyAccount = async(req, res, next) => {
    const { name, address, phone, email} = req.body;
    const user = await userService.getUserByUsername(req.user.username);
    if(name)
        user.name=name;
    if(address)
        user.address=address;
    if(phone)
        user.phone=phone;

    await user.save();

    req.flash('success_msg', 'Thay đổi thành công');
    res.redirect('/users/my_account');
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
        await transporter.sendMail(mainOptions, function (error, info) {
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
                res.redirect('/users/forget');

            }));
    }
};

exports.getChangePassword = (req, res, next) => res.render('change_password', { userdata:req.user });

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

                    req.flash('success_msg', 'Tạo mật khẩu mới thành công, hãy thoát ra và đăng nhập lại để kiểm tra');
                    res.redirect('/users/change_password');

                }));
        }
        else {
            req.flash('error_msg', 'Sai mật khẩu cũ');
            res.redirect('/users/change_password');
        }
    });
};

exports.getLocked=(req,res,next)=>{
    res.render('lockedAccount',{userdata:req.user, active:"account"});
};

exports.postLocked = async (req, res, next) =>{
    const{username}=req.body;
    if(!username)
    {
        req.flash('error_msg', 'Hãy nhập tài khoản');
        res.redirect('/users/locked_account');
    }
    else
    {
        const user= await userService.getUserByUsername(username);
        if(user)
        {
            if(user.username=='admin')
            {
                req.flash('error_msg', 'Không thể khóa tài khoản này');
                res.redirect('/users/locked_account');
            }
            else
            {
                user.locked=true;
                user.save();
                req.flash('success_msg', 'Khóa tài khoản thành công');
                res.redirect('/users/locked_account');
            }

        }
        else
        {
            req.flash('error_msg', 'Sai tài khoản');
            res.redirect('/users/locked_account');
        }
    }

};

exports.getUnLocked = async(req,res,next)=>{
    res.render('unlockedAccount',{userdata:req.user, active:"account"});
};

exports.postUnLocked = async (req, res, next) =>{
    const{username}=req.body;
    if(!username)
    {
        req.flash('error_msg', 'Hãy nhập tài khoản');
        res.redirect('/users/unlocked_account');
    }
    else
    {
        const user= await userService.getUserByUsername(username);

        if(user)
        {
            user.locked=false;
            user.save();
            req.flash('success_msg', 'Mở khóa tài khoản thành công');
            res.redirect('/users/unlocked_account');
        }
        else
        {
            req.flash('error_msg', 'Sai tài khoản');
            res.redirect('/users/unlocked_account');
        }

    }
};

exports.getShop = async (req, res, next) => {
    if (req.user.author === 'admin') {
        const data = await userService.getUserByAuthor("shop");
        res.render('shop', {userdata: req.user, shops: data, active: "shop"});
    } else {
        res.redirect('/');
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
//hàm tạo ra mảng 2 chiều sản phẩm
function pageElementsArr(arr, eleDispCount) {
    const arrLen = arr.length;
    const noOfPages = Math.ceil(arrLen / eleDispCount);
    let pageArr = [];
    let perPageArr = [];
    let index = 0;
    let condition = 0;
    let remainingEleInArr = 0;

    for (let i = 0; i < noOfPages; i++) {

        if (i === 0) {
            index = 0;
            if (arrLen>=eleDispCount)
            {
                condition = eleDispCount;
            }
            else
            {
                condition=arrLen;
            }
        }
        for (let j = index; j < condition; j++) {
            perPageArr.push(arr[j]);
        }
        pageArr.push(perPageArr);
        if (i === 0) {
            remainingEleInArr = arrLen - perPageArr.length;
        } else {
            remainingEleInArr = remainingEleInArr - perPageArr.length;
        }

        if (remainingEleInArr > 0) {
            if (remainingEleInArr > eleDispCount) {
                index = index + eleDispCount;
                condition = condition + eleDispCount;
            } else {
                index = index + perPageArr.length;
                condition = condition + remainingEleInArr;
            }
        }
        perPageArr = [];
    }
    return pageArr;
}