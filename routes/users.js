const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

//user routes '/'

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res, next) => {
    try {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => { //login user after registering
        if (err) return next(err);
        req.flash('success', 'Welcome to Room Reviews!');
        res.redirect('/hotels');
    })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))
// login form route
router.get('/login', (req, res) => {
    res.render('users/login');  
})
// login post route
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/hotels';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out.');
        res.redirect('/hotels');
    });
})

module.exports = router;