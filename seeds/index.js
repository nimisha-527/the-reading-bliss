const mongoose = require('mongoose');
const Books = require('../models/books');
const bookData = require('./bookData');

// We can use the below two urls to generate the image (random images)
// https://picsum.photos/400?random=${Math.random()}
//https://picsum.photos/id/24/200/300 : ----- 24 - image number, we can use Math.random to generate it
// 200 and 300 are sizes of the image


mongoose.connect('mongodb://localhost:27017/reading-bliss', {
    useNewURLParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("database established")
})
.catch(err => {
    console.log(err)
    console.log("Database Failed");
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Failed"));
db.once("open", () => {
    console.log("Connected to database")
});

const seedDB = async() => {
    await Books.deleteMany({});
    const b = await Books.insertMany(bookData).then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}

seedDB().then(() => { 
    mongoose.connection.close();
});