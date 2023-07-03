/* eslint linebreak-style: ["error", "windows"] */
const cluster = require('cluster');
const cCPUs = require('os').cpus().length;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const db = require('./db');

const setupApp = () => {
  dotenv.config();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(async (req, res, next) => {
    if (req.url === '/update' || req.url === '/delete' || req.url === '/create-update-product' || req.url === '/create-category') {
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (!token) {
        res.status(403).send('A token is required for authentication');
        return;
      }
      try {
        const tokenKey = process.env.TOKEN_KEY;
        jwt.verify(token, tokenKey);
        const user = await db.getUserByToken(token);
        if (user && user.is_admin) {
          next();
        } else {
          console.log(`Token: ${token}, Logged in user: ${user.username} and ${user.is_admin}`);
          res.status(401).send('Invalid Token or user not allowed to perform this operation');
        }
      } catch (err) {
        console.log('Error: ', err);
        res.status(401).send('Invalid Token');
      }
    } else if (req.url === '/add-product-to-cart' || req.url === '/checkout') {
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      if (!token) {
        res.status(403).send('A token is required for authentication');
        return;
      }
      try {
        const tokenKey = process.env.TOKEN_KEY;
        jwt.verify(token, tokenKey);
        next();
      } catch (err) {
        console.log('Error: ', err);
        res.status(401).send('Invalid Token');
      }
    } else {
      next();
    }
  });
  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  db.connectDB();
};

for (let i = 0; i < cCPUs; i += 1) {
  if (!cluster.isWorker) {
    setupApp();
    cluster.fork();
  }
}
module.exports = app;
