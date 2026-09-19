import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: {
        type: String,
    },
    rating: {
        type: Number,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

export default mongoose.model('Review', reviewSchema);