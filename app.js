const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
// const { fileURLToPath } = require('url');
const mongoose = require('mongoose');
const { bookJson } = require('./public/index');
const ejsMate = require('ejs-mate');
const { expressError } = require('./utils/index');
const { readingBlissRoutes } = require('./views/route/index');

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

app.use('/readingBliss', readingBlissRoutes);

app.get('/', (req, res) => {
    res.render("home", {bookJson})
});

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

