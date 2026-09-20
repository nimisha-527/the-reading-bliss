import express from "express";
import { wrapAsync, isLoggedIn, isOwner, validateBooks } from "../utils/index.js";
import reviewsRoutes from "./reviews.js";
import {index, renderAboutUs, renderGallery, renderContactUs, renderNewForm, addNewBook, renderDetailsPage, renderEditForm, editBooks, deleteBooks} from "../controllers/readingBliss.js";
import multer from "multer";
import { uploadFile } from "../cloudinary/index.js";

const router = express.Router();

const upload = multer({ storage: uploadFile, limits: { fileSize:  5 * 1024 * 1024 } });

router.get('/', isLoggedIn, wrapAsync(index));

router.get('/aboutUs', wrapAsync(renderAboutUs));

router.get('/gallery', wrapAsync(renderGallery));

router.get('/contact', wrapAsync(renderContactUs));

router.get('/newBook', isLoggedIn, wrapAsync(renderNewForm));

router.post('/', isLoggedIn, isOwner, upload.array('images'), validateBooks, wrapAsync(addNewBook));

router.get('/:id', wrapAsync(renderDetailsPage))

router.get('/:id/edit', isLoggedIn, wrapAsync(renderEditForm));

router.route('/:id')
.put(isLoggedIn, isOwner, upload.array('images'), validateBooks, wrapAsync(editBooks))
.delete(isLoggedIn, isOwner, wrapAsync(deleteBooks))


router.use('/:id/reviews', reviewsRoutes);

export default router;


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