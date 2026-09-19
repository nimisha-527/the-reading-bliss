import express from 'express';
const router = express.Router({mergeParams: true}); // merge params helps in merging our params accross routes. Because the ID will not be present as params were in different files. ID is passed in readingBliss routes but could not be accessed in reviews route file so this argument is useful.
import { wrapAsync, isLoggedIn, isReviewAuthor, validateReviews } from '../utils/index.js';
import {createNewReview, deleteReview} from '../controllers/reviews.js';

// posting the review and then redirecting it to the page with all the review for that particular book. That is why we are passing the ID so we can take that and show details accordingly
router.post('/', isLoggedIn, validateReviews, wrapAsync(createNewReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

export default router;