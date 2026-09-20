import mongoose from "mongoose";

const Schema = mongoose.Schema;

const recommendedSchema = new Schema({
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

export default mongoose.model('Recommend', recommendedSchema);