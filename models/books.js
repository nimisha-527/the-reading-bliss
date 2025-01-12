const mongoose = require("mongoose");
const Reviews = require("./review");
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
    },
    recommended: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// post middleware are executed after the hooked method and all of its pre middleware have completed. "findOneAndDelete" is the middleware the will trigger with "findByIdAndDelete"
bookSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Reviews.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;