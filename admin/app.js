var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var passport=require('passport');
const session = require('express-session');
var bodyParser = require('body-parser');
const flash=require('connect-flash');
var app = express();

//Passport config
require('./config/passport')(passport);


//connect DB
//options quan trọng là user với pass
let options={
  db:{native_parser:true},
  server:{poolSize:5},
  user:"tdat130999",
  pass: "kamenrider130999"
};
//đường dẫn tới database tên project ở mongoDB atlas (cloud)
var uri= "mongodb+srv://ptudweb-projectck-mbe9q.mongodb.net/project";

//Use native Promises
mongoose.Promise=global.Promise;
mongoose.connect(uri,options).then(
    ()=>{
      console.log('Connect DB successfully');

    },
    err=>{
      console.log('Connection failed. Error: ${err}');
    }
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyParser.urlencoded({ extended: true }));



//express session
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized:true

}));

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=> {
    res.locals.success_msg=req.flash('success_msg');

    res.locals.error_msg=req.flash('error_msg');

    res.locals.error=req.flash('error');

    next();
});
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
