// ejs-mate is used for layout, partials and block template functions for the EJS template engine
import dotenv from "dotenv";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import methodOverride from "method-override";
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import mongoStore from "connect-mongo";
import lusca from "lusca";

import {bookJson, icons} from "./public/index.js";
import { readingBlissRoutes, userRoutes, recommendRoutes, connectToCustomerRoutes } from "./route/index.js";
import User from "./models/user.js";
// set up rate limiter: maximum of five requests per minute
import RateLimit from "express-rate-limit";

const MongoStore = mongoStore;
const app = express();
const __filename = fileURLToPath(import.meta.url); // use this when using "type": "module" in the package.json for implementing import & export instead of require
const __dirname = path.dirname(__filename); // use this when using "type": "module" in the package.json for implementing import & export instead of require
// const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/reading-bliss";
const dbUrl = "mongodb://127.0.0.1:27017/reading-bliss"
mongoose.connect(dbUrl)
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

app.engine('ejs', ejsMate); // defining ejs engine to ejsmate to tell the app that we will not use default one but this one
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static( path.join(__dirname, "public") ));
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    const sanitizeOptions = {replaceWith: '--'};
    [req.body, req.params, req.headers, req.query].forEach((value) => {
        if (value) mongoSanitize.sanitize(value, sanitizeOptions);
    });
    next();
});

const secret = process.env.SECRET_KEY || 'thisisnotasecret';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (err) {
    console.log("SESSION ERROR: ", err)
})
const sessionConfig = {
    store,
    name:"session",
    secret,
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
app.use(lusca.csrf());
app.use(lusca.xssProtection(true));
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com"
];
const connectSrcUrls = [
    "https://cdn.jsdelivr.net"
];
const fontSrcUrls = [
    "http://www.w3.org",
    "https://cdnjs.cloudflare.com",
    "https://fonts.gstatic.com"
];
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

var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
app.use(limiter);

let getNavLinkColor = '';
let getNavToggleColor = '';
const setNavLinkColor = (value) => {
    const {dark, light} = value;
    if(dark) {
        getNavLinkColor = 'nav-link-dark';
        getNavToggleColor = 'nav-toggle-dark';
    } else if(light) {
        getNavLinkColor = 'nav-link-light';
        getNavToggleColor = 'nav-toggle-light';
    } else {
        getNavLinkColor = '';
        getNavToggleColor = '';
    }
}
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // we have access to the current user, in our middleware file we have function isLoggedIn, there req.user gives us the user details when logged in, now since this app.use with res.local we are accessing everywhere in our project so that is why we are passing a new key currentUser to it with req.user so that we can show/hide the things we wants to differentiate when customer is logged in or logged out.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
})

app.use('/readingBliss', recommendRoutes);
app.use('/readingBliss', userRoutes);
app.use('/readingBliss', connectToCustomerRoutes)
app.use('/readingBliss', readingBlissRoutes);

app.get('/', (req, res) => {
    const homeStatic = bookJson.home;
    setNavLinkColor({dark: true, light: false});
    res.render("home", {homeStatic, bookJson, icons, isNavTransparent: true, getNavLinkColor, getNavToggleColor})
});

app.all(/.*/, (req, res, next) => {
    // next(new expressError("PAGE NOT FOUND", 404));
    const staticPageNotFound = bookJson.errorScenario.pageNotFound;
    res.render("readingBliss/pageNotFound", {staticPageNotFound});
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    const staticError = bookJson.errorScenario.technicalError;
    if(!err.message) err.message = "Something went wrong!!!";
    console.dir(err,"--error ") // Printing this so to know the error message
    setNavLinkColor({dark: false, light: false});
    res.status(statusCode).render("error" , {bookJson, icons, staticError, isNavTransparent: false, getNavLinkColor, getNavToggleColor});
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}....`);
});

