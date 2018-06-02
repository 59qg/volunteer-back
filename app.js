var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var config = require('./config');
var Restmsg = require('./common/restmsg');

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
app.use(config.web.context, express.static(path.join(__dirname, 'public')));

app.use(session({
    name: 'volunteer',
    secret: 'volunteer',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    unset: 'destroy', //The session will be destroyed (deleted) when the response ends.
    maxAge: 7 * 24 * 60 * 60 * 1000,
    store: new MongoStore({
        url: config.mongodb.url,
        ttl: 7 * 24 * 60 * 60 // = 1 days. Default
    })
}))

app.use(function(req, res, next) {
    if (req.headers.origin == 'http://localhost:8003') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    } else {
        next();
    }
})

app.use(function(req, res, next) {
    let url = req.originalUrl;
    if((url.indexOf('appapi')==-1)&&(url.indexOf('login') == -1)){
        //登陆判断
        if(!req.session.id){
            res.redirect('');
        }
        else{
            next()
        }
    }
    else {
        let restmsg = new Restmsg();
        if(req.query.token == null && req.query.token == ''
            && (url.indexOf('login') == -1) && (url.indexOf('register') == -1)
            && (url.indexOf('list') == -1) && (url.indexOf('detail'))
            && (url.indexOf('news') == -1)
        ) {
            restmsg.setNoLogin('未登录');
            return res.send(restmsg);
        }
        else {
            next();
        }
    }
});

//app.use('/', indexRouter);
//app.use('/api', usersRouter);
app.use(config.web.context+'/appapi', appapi);
app.use(config.web.context+'/api', api);

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
