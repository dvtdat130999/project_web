const bcrypt=require('bcryptjs');
const randomstring=require('randomstring');
const nodemailer=require('nodemailer');
const user = require('../databasemodel/users')

//CREATE
exports.insertUser = (newUser)=> {
    bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw  err;
            //Set password to hashed
            newUser.password = hash;

            //secret token for verify
            newUser.secretToken = randomstring.generate();

            newUser.save();

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
                subject: 'Kích hoạt tài khoản',
                html: 'Chào ' + newUser.name + '<br>'
                    + 'Bạn cần nhập mã sau: ' + newUser.secretToken + '<br>'
                    + 'ở trang: ' + '<a href="http://localhost:3000/users/verify">http://localhost:3000/users/verify</a>'
            }
            transporter.sendMail(mainOptions, function (error, info) {
                if (error) { // nếu có lỗi
                    console.log(error);
                } else { //nếu thành công
                    console.log('Email sent: ' + info.response);
                }
            });
        }));
}


//UPDATE


//READ
exports.getUserBySecretToken = (secretToken) => {
    return user.findOne({secretToken: secretToken});
}

exports.getUserByUsername = (username) => {
    return user.findOne({username: username});
}

exports.getUserByEmail = (email) => {
    return user.findOne({email: email});
}
//DELETE