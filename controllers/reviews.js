const Reviews = require('../models/review');
const Books = require('../models/books');
module.exports.createNewReview = async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    const review = new Reviews(req.body.review);
    review.owner = req.user._id;
    foundBook.reviews.push(review);
    await review.save();
    await foundBook.save();
    req.flash('success', "review added successfully")
    res.redirect(`/readingBliss/${foundBook._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Books.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success', "review deleted successfully")
    res.redirect(`/readingBliss/${id}`)
}