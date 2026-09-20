import express from "express";
import passport from "passport";
import { wrapAsync, storeReturnTo } from "../utils/index.js";
import {renderRegisterForm, register, renderLoginForm, logout, login} from "../controllers/user.js";
const router = express.Router();

router.route('/register')
.get(renderRegisterForm)
.post(wrapAsync(register), passport.authenticate('local', {failureFlash: true, failureRedirect: '/readingbliss/register'}))

//passport.authenticate is the method that passport package gives us.
// By using storeReturnTo middleware fn, we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo. This enables us to access and use returnTo value (via res.locals.returnTo) later the middleware chain so that we can redirect users to the approriate page after they have logged in.
router.route("/login")
.get(renderLoginForm)
.post(
    storeReturnTo, 
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/readingbliss/login'}), 
    login
)


router.get('/logout', wrapAsync(logout))

export default router;