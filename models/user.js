const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    // emailId: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    name: {
        type: String,
        required: true
    }
})

// We do not need to add the username and password fields because with the below code at line 16 of this file, the passport-local-mongoose plugin already does that for us
// refrences: https://www.npmjs.com/package/passport-local-mongoose ; https://github.com/saintedlama/passport-local-mongoose#api-documentation
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);