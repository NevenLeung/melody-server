'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cors = require('cors');

const config = require('./config');

mongoose.connect(config.mongoDBUrl, {useMongoClient: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', function () {
    console.log('Connected successfully to server');
});

const User = require('./models/users');

const index = require('./routes/index');
const songRouter = require('./routes/songRouter');
const artistRouter = require('./routes/artistRouter');
const userRouter = require('./routes/userRouter');


let app = express();

// to solve the cross-origin problem
app.use(cors());

// Sceure traffic only
// app.all('*', function(req, res, next) {
//     console.log('req start: ', req.hostname, req.url, 'Secure: ' + req.secure, 'Method: ' + req.method);
//     if (req.secure) {
//         return next();
//     }
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
// });

// use passport to handle user authentication
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/singer', artistRouter);
app.use('/music', songRouter);
app.use('/userCenter', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
