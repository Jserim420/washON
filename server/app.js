// app.js : 서버처리
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
var usersRouter = require('./routes/users');



// DB연결
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('washon', 'root', '', {
  host: 'localhost',
  dialect: "mysql",
  logging: false
});

// 세션 설정
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'tpfla9876',
  database: 'washon'
};
const sessionStore = new MySQLStore(options);
app.use(session({
  key: 'loginkey',
  secret: 'itc801!',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// 모델 가져오기
var modelInit = require("./model.js")
modelInit(Sequelize, sequelize)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../dist')));

app.use('/api', indexRouter);
app.use('/api/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
