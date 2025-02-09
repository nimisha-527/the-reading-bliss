const mongoose = require('mongoose');

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

module.exports = mongoose.model('Recommend', recommendedSchema);