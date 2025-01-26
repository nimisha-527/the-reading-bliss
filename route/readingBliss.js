const express = require('express');
const app = express();
const router = express.Router();
const { wrapAsync, isLoggedIn, isOwner,validateBooks } = require('../utils/index');
const reviewsRoutes = require('./reviews');
const readingBlissController = require('../controllers/readingBliss');
// const randomColumn1 = Math.floor(Math.random() * 2) + 2553427;

router.get('/', isLoggedIn, wrapAsync(readingBlissController.index));

router.get('/aboutUs', wrapAsync(readingBlissController.renderAboutUs));

router.get('/gallery', wrapAsync(readingBlissController.renderGallery));

router.get('/contact', wrapAsync(readingBlissController.renderContactUs));

router.get('/newBook', isLoggedIn, wrapAsync(readingBlissController.renderNewForm));

router.post('/', isLoggedIn, isOwner, validateBooks, wrapAsync(readingBlissController.addNewBook))

router.get('/:id', isLoggedIn, wrapAsync(readingBlissController.renderDetailsPage))

router.get('/:id/edit', isLoggedIn, wrapAsync(readingBlissController.renderEditForm));

router.route('/:id')
.put(isLoggedIn, isOwner, validateBooks, wrapAsync(readingBlissController.editBooks))
.delete(isLoggedIn, isOwner, wrapAsync(readingBlissController.deleteBooks))


router.use('/:id/reviews', reviewsRoutes);

module.exports = router;


//ERRORS:

// getting this error "Cannot set headers after they are sent to the client"
// if I am clubbing :
// 1. router.route('/')
// .get(isLoggedIn, wrapAsync(readingBlissController.index))
// .post(isLoggedIn, isOwner, validateBooks, wrapAsync(readingBlissController.addNewBook))
// 2. router.route('/:id')
// .get(isLoggedIn, wrapAsync(readingBlissController.renderDetailsPage))
// .put(isLoggedIn, isOwner, validateBooks, wrapAsync(readingBlissController.editBooks))
// .delete(isLoggedIn, isOwner, wrapAsync(readingBlissController.deleteBooks))
// because the index page is supposed to load first and not have any sc hema updated and same goes that edit form should be updated after the edit form is load. With this clubbing the index is loading after renderNewForm and so giving above error same happening in editForm as the page it should be redirected to should be before.
// REFER: https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
// In simple words, the hierarcy of your page load matters, this error tells that only.