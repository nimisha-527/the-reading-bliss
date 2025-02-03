// ejs-mate is used for layout, partials and block template functions for the EJS template engine
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
// const { fileURLToPath } = require('url');
const mongoose = require('mongoose');
const { bookJson } = require('./public/index');
const ejsMate = require('ejs-mate');
const { expressError } = require('./utils/index');
const { readingBlissRoutes, userRoutes, recommendRoutes } = require('./route/index');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet")

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
const PORT = process.env.PORT || 8080;

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
app.use(
    mongoSanitize({
      replaceWith: '--',
    }),
  );

const sessionConfig = {
    name:"session",
    secret: "thisisnotasecret",
    resave:false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// session expires in one week, above calcuation is for that purpose.
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://fonts.googleapis.com"
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "connect-src": ["'self'", ...connectSrcUrls],
            "script-src": ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            "style-src": ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            "worker-src": ["'self'", "blob:"],
            "child-src": ["blob:"],
            "object-src": [],
            "img-src": [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzjms6aad/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://images.pexels.com",
                "https://ashsinfinitelibrary.wordpress.com",
                "https://i0.wp.com/fannaforbooks.com",
                "https://perireads.com",
                "https://platform.vox.com",
                "https://i0.wp.com",
                "https://tyshiashante.com",
                "https://picsum.photos",
                "https://michellehickey.design",
                "https://www.gateshousings.com",
                "https://i.pinimg.com"
            ],
            "font-src": ["'self'", ...fontSrcUrls],
        },
    }
}));

app.use(passport.initialize()); // look for the docs passport.js for better understanding
app.use(passport.session()); // look for the docs passport.js for better understanding. And this comes after the session according to docs

passport.use(new LocalStrategy(User.authenticate())); // this method authenticate comes from passport.

passport.serializeUser(User.serializeUser()); // this method serializeUser comes from passport. Basically store
passport.deserializeUser(User.deserializeUser()); // this method deserialize current user. Basically destore

// app.get('/fakeUser', async (req, res) => {
//     const user = await new User({username: "nimisha", emailId:"nimisha@gmail.com", name: "nim"});
//     const newUser = await User.register(user, "hello");
//     res.send(newUser);
// })
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // we have access to the current user, in our middleware file we have function isLoggedIn, there req.user gives us the user details when logged in, now since this app.use with res.local we are accessing everywhere in our project so that is why we are passing a new key currentUser to it with req.user so that we can show/hide the things we wants to differentiate when customer is logged or logged out.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
})

app.use('/readingBliss', recommendRoutes);
app.use('/readingBliss', userRoutes);
app.use('/readingBliss', readingBlissRoutes);

app.get('/', (req, res) => {
    res.render("home", {bookJson})
});

app.all('*', (req, res, next) => {
    // next(new expressError("PAGE NOT FOUND", 404));
    res.render("readingBliss/pageNotFound");
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong!!!";
    res.status(statusCode).render("error" , {err});
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}....`);
});

