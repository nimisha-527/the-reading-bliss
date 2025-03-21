const Books = require('../models/books');
const Review = require('../models/review');
const expressError = require('./ExpressError');
const { booksSchema, reviewSchema } = require('../schemas');
module.exports.isLoggedIn = (req, res, next) => {
    //isAuthenticated() is the helper function from passport
    if (!req.isAuthenticated()) {
        console.log("not authenticated")
        req.session.returnTo = req.originalUrl;
        req.flash('error', "Please sign in first");
        return res.redirect('/readingBliss/login');
    }
    next();
}

// Below function is called before customer is logged in. We are calling this because when the user is trying to access newBook page and he needs to login for that then that url is stored in the session so we try to access that url with returnTo and store it in our locals(res.locals is the object that provides a way to pass data through application during req-res cycle. It allows you to store variables that can be accessed by your templates and other middleware functions)
module.exports.storeReturnTo = (req, res, next) => {
    if(req.session && req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Below Code  - so that only the owner of the book is allowed to edit or delete the book.
module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const books = await Books.findById(id);
    if(books?.owner && !books.owner.equals(req.user._id)) {
        req.flash('error', "You do not have permission to access this.");
        return res.redirect(`/readingBliss/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const reviews = await Review.findById(reviewId);
    if(!reviews.owner.equals(req.user._id)) {
        req.flash('error', "You do not have permission to access this.");
        return res.redirect(`/readingBliss/${id}`);
    }
    next();
}

module.exports.validateBooks = (req, res, next) => {
    const { error } = booksSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReviews = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        throw new expressError(msg, 400);
    } else {
        next();
    }
}