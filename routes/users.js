const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

// register form route
router.get('/register', users.renderRegisterForm);

// register post route
router.post('/register', catchAsync(users.register));

// login form route
router.get('/login', users.renderLoginForm);

// login post route
router.post('/login', storeReturnTo, 
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);

// logout route
router.get('/logout', users.logout);

module.exports = router;