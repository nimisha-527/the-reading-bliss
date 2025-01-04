const express = require('express');
const router = express.Router();
const Books = require('../../models/books');
const Reviews = require('../../models/review');
const {wrapAsync, expressError} = require('../../utils/index');
const { reviewSchema } = require('../../schemas');

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
router.post('/:id/reviews', validateReviews, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    const review = new Reviews(req.body.review);
    foundBook.reviews.push(review);
    await review.save();
    await foundBook.save();
    res.redirect(`/readingBliss/${foundBook._id}`)
}));

router.delete('/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Books.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect(`/readingBliss/${id}`)
}));

module.exports = router;