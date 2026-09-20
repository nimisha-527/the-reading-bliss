import User from "../models/user.js";
import { bookJson, icons } from "../public/index.js";

let getNavLinkColor = '';
let getNavToggleColor = '';
const setNavLinkColor = (value) => {
    const {dark, light} = value;
    if(dark) {
        getNavLinkColor = 'nav-link-dark';
        getNavToggleColor = 'nav-toggle-dark';
    } else if(light) {
        getNavLinkColor = 'nav-link-light';
        getNavToggleColor = 'nav-toggle-light';
    } else {
        getNavLinkColor = '';
        getNavToggleColor = '';
    }
}

export const renderRegisterForm = (req, res) => {
    const registerStatic = bookJson.register;
    setNavLinkColor({dark: false, light: false});
    res.render('readingBliss/register', { registerStatic, bookJson, icons, isNavTransparent: false, getNavLinkColor, getNavToggleColor });
}

export const register = async (req, res, next) => {
    const {username, password, name} = req.body
    try {
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
            req.flash('error', 'Something went wrong. Please try again later.');
            res.redirect('/readingbliss/register');
        }
    }
}

export const renderLoginForm = (req, res) => {
    const loginStatic = bookJson.login;
    setNavLinkColor({dark: false, light: false});
    res.render('readingBliss/login', { loginStatic, bookJson, icons, isNavTransparent: false, getNavLinkColor, getNavToggleColor });
}

export const login = async (req, res) => {
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

export const logout = async function(req, res, next) {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash('success',`You have logged out successfully.`);
        res.redirect('/');
    });
}