const express = require('express');
const router = express.Router({mergeParams: true}); // merge params helps in merging our params accross routes. Because the ID will not be present as params were in different files. ID is passed in readingBliss routes but could not be accessed in reviews route file so this argument is useful.
const Books = require('../models/books');
const Reviews = require('../models/review');
const {wrapAsync, expressError, isLoggedIn, isReviewAuthor} = require('../utils/index');
const { reviewSchema } = require('../schemas');

const validateReviews = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        throw new expressError(msg, 400);
    } else {
        next();
    }
}
// posting the review and then redirecting it to the page with all the review for that particular book. That is why we are passing the ID so we can take that and show details accordingly
router.post('/', isLoggedIn, validateReviews, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    const review = new Reviews(req.body.review);
    review.owner = req.user._id;
    foundBook.reviews.push(review);
    await review.save();
    await foundBook.save();
    req.flash('success', "review added successfully")
    res.redirect(`/readingBliss/${foundBook._id}`)
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Books.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success', "review deleted successfully")
    res.redirect(`/readingBliss/${id}`)
}));

module.exports = router;