var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var apiRouter = require('./routes/api');

var app = express();

var port = process.env.PORT || 3001;

app.use(cors());
//app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

// api defined first to not conflict with React below
app.use('/api', apiRouter);

// React requires path to go to index.html so that it can handle routes
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });

app.listen(port, () => console.log(`Listening on port ${port}`));