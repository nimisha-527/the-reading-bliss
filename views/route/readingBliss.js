const express = require('express');
const app = express();
const router = express.Router();
const Books = require('../../models/books');
const { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 } = require('../../public/index');
const { wrapAsync, expressError } = require('../../utils/index');
const { booksSchema } = require('../../schemas');
const reviewsRoutes = require('./reviews');
// const randomColumn1 = Math.floor(Math.random() * 2) + 2553427;

const validateBooks = (req, res, next) => {
    const { error } = booksSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res) => {
    const bookLibrary = await Books.find({});
    res.render("readingBliss/index", { bookLibrary, bookJson });
}));

router.get('/newBook', wrapAsync(async (req, res) => {
    res.render("readingBliss/new", { bookJson })
}));

router.post('/', validateBooks, wrapAsync(async (req, res) => {
    // if(!req.body.books) throw new expressError("INVALID DATA", 400);
    // const randomNumber = Math.floor(Math.random() * 11) + 1 
    // console.log(`https://picsum.photos/id/${randomNumber}/200/200`)
    const newBook = await new Books(req.body)
    // if(newBook.images === "") {
    //  const randomNumber = Math.floor(Math.random() * 11) + 1 
    //     newBook.images = `https://picsum.photos/id/${randomNumber}/200/200` // trying if image is not uploaded in the form then by defualt a image will be uploaded
    // }
    await newBook.save();
    res.redirect(`/readingBliss/${newBook._id}`)
}));

router.get('/aboutUs', wrapAsync(async (req, res) => {
    res.render("readingBliss/aboutUs", { bookJson });
}));

router.get('/gallery', wrapAsync(async (req, res) => {
    // const randomImageColumn1 = bookJson.galleryImage.replaceAll('#randomImage#', randomColumn1)
    res.render("readingBliss/gallery", { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 });
}));

router.get('/contact', wrapAsync(async (req, res) => {
    res.render("readingBliss/contact", { bookJson });
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id).populate('reviews');
    res.render("readingBliss/details", { foundBook, bookJson });
}));

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/edit", { book: foundBook, bookJson });
}));

router.put('/:id', validateBooks, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    await foundBook.save()
    res.redirect("/readingBliss");
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Books.findByIdAndDelete(id);
    res.redirect("/readingBliss");
}));

router.use('/', reviewsRoutes)

module.exports = router;