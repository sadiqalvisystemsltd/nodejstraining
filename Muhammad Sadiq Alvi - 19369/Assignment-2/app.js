var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require("jsonwebtoken");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if(req.url == "/update" || req.url == "/delete") {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
      }
      try {
        const tokenKey = process.env.TOKEN_KEY;
        jwt.verify(token, tokenKey);
        next();
      } catch (err) {
          console.log("Error: ", err);
          res.status(401).send("Invalid Token");
          return;
      }
  } else {
    next();
  }
  
});

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
