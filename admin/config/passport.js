const LocalStrategy = require('passport-local').Strategy;
var user = require('../databasemodel/users');
var bcrypt=require('bcryptjs');

module.exports=function (passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            user.findOne({ username: username }, function (err, user) {

                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Sai tài khoản' });
                }
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw  err;
                    if(isMatch)
                    {
                        return done(null,user);
                    }
                    else
                    {
                        return done(null, false, { message: 'Sai mật khẩu' });

                    }
                });


            });
        }
    ));
    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
        user.findById(id, (err, user)=> {
            done(err, user);
        });
    });
}
