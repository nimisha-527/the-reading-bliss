const express = require('express');
const router = express.Router();
const { wrapAsync, storeReturnTo } = require('../utils');
const passport = require('passport');
const userController = require('../controllers/user');

router.route('/register')
.get(userController.renderRegisterForm)
.post(wrapAsync(userController.register))

//passport.authenticate is the method that passport package gives us.
// By using storeReturnTo middleware fn, we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo. This enables us to access and use returnTo value (via res.locals.returnTo) later the middleware chain so that we can redirect users to the approriate page after they have logged in.
router.route("/login")
.get(userController.renderLoginForm)
.post(
    storeReturnTo, 
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/readingbliss/login'}), 
    userController.login
)


router.get('/logout', wrapAsync(userController.logout))

module.exports = router;