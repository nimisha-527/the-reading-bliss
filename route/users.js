const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { wrapAsync, expressError, storeReturnTo } = require('../utils/index');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('readingBliss/register');
})

router.post('/register', wrapAsync( async (req, res) => {
    console.log(req.body);
    const {username, password, emailId, name} = req.body
    try {
        const user = await new User({username, password, emailId, name});
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to the reading bliss ${name}`)
            res.redirect('/readingbliss');
        });
    } catch (err) {
        console.log(err);
        const keyValue = err?.errorResponse?.keyValue;
        const duplicate = err?.errorResponse?.errmsg?.match('duplicate');
        if(duplicate) {
            const getDuplicateKeys = Object.keys(keyValue);
            for(let element of getDuplicateKeys) {
                req.flash('error', `A user with ${element} is already registered`)
                res.redirect('/readingbliss/register');
            }
        } else {
            req.flash('error', `Something went wrong. Please try again later.`)
        }
        // if(err.errorResponse.keyValue)
    }
}))

router.get('/login', (req, res) => {
    res.render('readingBliss/login');
})

//passport.authenticate is the method that passport package gives us.
// By using storeReturnTo middleware fn, we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo. This enables us to access and use returnTo value (via res.locals.returnTo) later the middleware chain so that we can redirect users to the approriate page after they have logged in.
router.post('/login',storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/readingbliss/login'}), (req, res) => {
    console.log(req.body,"----bpdy login");
    const {username} = req.body;
    try {
        req.flash('success',`Welcome back, ${username}`);
        const redirectUrl = res.locals.returnTo || '/readingBliss';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    } catch (err) {
        req.flash('error',`Something went wrong. Please try again later.`);
        res.redirect('/readingBliss/login');
    }
})

router.get('/logout', wrapAsync(async function(req, res) {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash('success',`You are successfully logout`);
        res.redirect('/');
    });
}))

module.exports = router;