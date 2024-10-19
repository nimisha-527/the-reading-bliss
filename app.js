const express =  require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
// const { fileURLToPath } = require('url');
const mongoose = require('mongoose');
const Books = require('./models/books');
const { bookJson } = require('./public/index');
const ejsMate = require('ejs-mate');

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


app.get('/', (req, res) => {
    res.render("home", {bookJson})
});

app.get('/readingBliss', async (req, res) => {
    const bookLibrary = await Books.find({});
    res.render("readingBliss/index", {bookLibrary, bookJson});
});

app.get('/readingBliss/newBook', async (req, res) => {
    res.render("readingBliss/new", {bookJson})
});

app.post('/readingBliss', async (req, res) => {
    const newBook = await new Books(req.body)
    await newBook.save();
    res.redirect(`/readingBliss/${newBook._id}`)
});

app.get('/readingBliss/:id', async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/details", {foundBook, bookJson});
});

app.get('/readingBliss/:id/edit', async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/edit", {book: foundBook, bookJson});
});

app.put('/readingBliss/:id', async (req, res) => {
    const {id} = req.params;
    const foundBook = await Books.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    await foundBook.save()
    res.redirect("/readingBliss");
});

app.delete('/readingBliss/:id', async (req, res) => {
    const {id} = req.params;
    console.log(id)
    await Books.findByIdAndDelete(id);
    res.redirect("/readingBliss");
});

app.listen(8080, () => {
    console.log('listening on port 8080');
});

