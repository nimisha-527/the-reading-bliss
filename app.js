const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
// const { fileURLToPath } = require('url');
const mongoose = require('mongoose');
const Books = require('./models/books');
const { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 } = require('./public/index');
const {booksSchema, reviewSchema} = require('./schemas');
const ejsMate = require('ejs-mate');
const { wrapAsync, expressError } = require('./utils/index');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
// const randomColumn1 = Math.floor(Math.random() * 2) + 2553427;

mongoose.connect('mongodb://localhost:27017/reading-bliss', {
    useNewURLParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Mongo Connection established")
})
.catch(err => {
    console.log(err)
    console.log("Mongo Connection Failed");
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Failed"));
db.once("open", () => {
    console.log("Connected Successfully to database")
})

// const __filename = fileURLToPath(import.meta.url); // use this when using "type": "module" in the package.json for implementing import & export instead of require
// const __dirname = path.dirname(__filename);
app.engine('ejs', ejsMate); // defining ejs engine to ejsmate to tell the app that we will not use default one but this one
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static( path.join(__dirname, "public") ));
app.use(express.urlencoded({extended: true}));

// const wrapAsync = (fn) => {

// }

const validateBooks = (req, res, next) => {
    const {error} = booksSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReviews = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render("home", {bookJson})
});

app.get('/readingBliss', wrapAsync(async (req, res) => {
    const bookLibrary = await Books.find({});
    res.render("readingBliss/index", {bookLibrary, bookJson});
}));

app.get('/readingBliss/newBook', wrapAsync(async (req, res) => {
    res.render("readingBliss/new", {bookJson})
}));

app.post('/readingBliss', validateBooks, wrapAsync(async (req, res) => {
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

app.get('/readingBliss/aboutUs', wrapAsync(async (req, res) => {
    res.render("readingBliss/aboutUs", {bookJson});
}));

app.get('/readingBliss/gallery', wrapAsync(async (req, res) => {
    // const randomImageColumn1 = bookJson.galleryImage.replaceAll('#randomImage#', randomColumn1)
    res.render("readingBliss/gallery", {bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4});
}));

app.get('/readingBliss/contact', wrapAsync(async (req, res) => {
    res.render("readingBliss/contact", {bookJson});
}));

app.get('/readingBliss/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id).populate('reviews');
    res.render("readingBliss/details", {foundBook, bookJson});
}));

app.get('/readingBliss/:id/edit', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/edit", {book: foundBook, bookJson});
}));

app.put('/readingBliss/:id', validateBooks, wrapAsync(async (req, res) => {
        const {id} = req.params;
        const foundBook = await Books.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
        await foundBook.save()
        res.redirect("/readingBliss");
}));

app.delete('/readingBliss/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Books.findByIdAndDelete(id);
    res.redirect("/readingBliss");
}));

// posting the review and then redirecting it to the page with all the review for that particular book. That is why we are passing the ID so we can take that and show details accordingly
app.post('/readingBliss/:id/reviews', validateReviews, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    const review = new Review(req.body.review);
    foundBook.reviews.push(review);
    await review.save();
    await foundBook.save();
    res.redirect(`/readingBliss/${foundBook._id}`)
}));

app.delete('/readingBliss/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Books.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/readingBliss/${id}`)
}));


app.all('*', (req, res, next) => {
    next(new expressError("PAGE NOT FOUND", 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong!!!";
    res.status(statusCode).render("error" , {err});
})

app.listen(8080, () => {
    console.log('listening on port 8080');
});

