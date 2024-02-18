var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser'); // helps to parse the body in the params

// start up the instances
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// set up the routes
var indexRouter = require('./routes/index');
var expensesRouter = require('./routes/expenses');
var statisticsRouter = require('./routes/statistics');
var adjustRouter = require('./routes/adjust');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var logoutRouter = require('./routes/logout');
var errorRouter = require('./routes/error');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout',logoutRouter);
app.use('/expenses', expensesRouter);
app.use('/statistics', statisticsRouter);
app.use('/adjust', adjustRouter);
app.use('/error', errorRouter);

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