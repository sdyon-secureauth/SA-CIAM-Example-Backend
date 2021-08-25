var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

var port = process.env.PORT || 3001;

app.use(cors());
//app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api', apiRouter);


app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
