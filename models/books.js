const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Thriller", "Fiction", "Fantasy", "Memoir", "Literary Fiction", "Science Fiction", "Historical Fiction"]
    },
    images: {
        type: String,
        required: false
    }
})

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;