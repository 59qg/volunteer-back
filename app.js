var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');

var api = require('./routes/api');
var appapi = require('./routes/appapi');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: 'volunteer',
    secret: 'volunteer',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: config.cookie,
    store: new RedisStore(config.sessionStore)
}))
app.use(function(req, res, next) {
    let url = req.originalUrl;
    if((url.indexof('appapi')==-1)&&(url.indexOf('login') == -1)){
        //登陆判断
        if(!req.session.id){
            res.redirect('');
        }
        else{
            next()
        }
    }
    else {
        next();
    }
});

//app.use('/', indexRouter);
//app.use('/api', usersRouter);
app.use('/appapi', appapi);
app.use('/api', api);

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
