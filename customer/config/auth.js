
module.exports={
    ensureAuthenticated:function (req,res,next) {
        if(req.isAuthenticated())
        {
            return next();
        }
        else
        {
            req.flash('error_msg','Hãy đăng nhập nếu bạn đã có tài khoản và hãy đăng ký nếu chưa có');
            res.redirect('/login');

        }


    }
}