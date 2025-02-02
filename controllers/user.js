const User = require('../models/user');
module.exports.renderRegisterForm = (req, res) => {
    res.render('readingBliss/register');
}

module.exports.register = async (req, res) => {
    console.log(req.body);
    // const {username, password, emailId, name} = req.body
    const {username, password, name} = req.body
    try {
        // const user = await new User({username, password, emailId, name});
        const user = await new User({username, password, name});
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
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('readingBliss/login');
}

module.exports.login = async (req, res) => {
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
}

module.exports.logout = async function(req, res) {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash('success',`You are successfully logout`);
        res.redirect('/');
    });
}