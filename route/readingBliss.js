const express = require('express');
const app = express();
const router = express.Router();
const Books = require('../models/books');
const { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 } = require('../public/index');
const { wrapAsync, expressError, isLoggedIn, isOwner } = require('../utils/index');
const { booksSchema } = require('../schemas');
const reviewsRoutes = require('./reviews');
const Recommend = require('../models/recommend');
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

router.get('/',isLoggedIn, wrapAsync(async (req, res) => {
    const bookLibrary = await Books.find({});
    res.render("readingBliss/index", { bookLibrary, bookJson });
}));

// router.get('/recommend', async (req, res) => {
//     res.send("on recommend");
// })
router.get('/aboutUs', wrapAsync(async (req, res) => {
    res.render("readingBliss/aboutUs", { bookJson });
}));

router.get('/gallery', wrapAsync(async (req, res) => {
    const books = await Books.find({});
    const recommendedList = await Recommend.find({});
    let recommendedBook =  [];
    for(let book of books ) {
        if(book.recommended && !recommendedList.length) {
            req.flash('error', "There are no recommended books at the moment. You can add the book by clicking on the recommended button from your collection.");
            const foundBookToUpdate = await Books.findByIdAndUpdate(book._id.toString(), { $set: { recommended: false }}, { runValidators: true, new: true });
            await foundBookToUpdate.save();
        } else if(book.recommended) {
            recommendedBook.push(book)
        }
    }

    // Explicitly declare four arrays
    let array1 = [];
    let array2 = [];
    let array3 = [];
    let array4 = [];

    // Store references to the target arrays
    let targetArrays = [array1, array2, array3, array4];

    // Distribute elements to the target arrays
    recommendedBook.forEach((item, index) => {
        let targetIndex = index % 4; // Since we have 4 arrays
        targetArrays[targetIndex].push(item);
    });

    let details1 = [], details2 = [], details3 = [], details4 = [];

    details1.push(array1);
    details2.push(array2);
    details3.push(array3);
    details4.push(array4);

    console.log(array1)

    res.render("readingBliss/gallery", { bookJson, recommendedBook, recommendedList, details1, details2, details3, details4 });

}));

router.get('/contact', wrapAsync(async (req, res) => {
    res.render("readingBliss/contact", { bookJson });
}));

router.get('/newBook', isLoggedIn, wrapAsync(async (req, res) => {
    res.render("readingBliss/new", { bookJson })
}));

router.post('/', isLoggedIn, isOwner, validateBooks, wrapAsync(async (req, res) => {
    const newBook = await new Books(req.body);
    newBook.owner = req.user._id;
    await newBook.save();
    req.flash('success', "Book added successfully")
    res.redirect(`/readingBliss/${newBook._id}`)
}));

router.get('/:id',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('owner');
    // console.log(foundBook,"----foundbook in details page");
    if(!foundBook) {
        req.flash('error', "Book you are searching for does not exists");
        return res.redirect('/readingBliss')
    }
    res.render("readingBliss/details", { foundBook, bookJson });
}));

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/edit", { book: foundBook, bookJson });
}));

router.put('/:id',isLoggedIn, isOwner, validateBooks, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Books.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', "Book Updated successfully")
    res.redirect(`/readingBliss/${id}`);
}));

router.delete('/:id',isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Books.findByIdAndDelete(id);
    req.flash('success', "Book deleted successfully")
    res.redirect("/readingBliss");
}));

router.use('/:id/reviews', reviewsRoutes);

module.exports = router;