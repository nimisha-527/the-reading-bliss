import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// We do not need to add the username and password fields because with the below code at line 16 of this file, the passport-local-mongoose plugin already does that for us
// refrences: https://www.npmjs.com/package/passport-local-mongoose ; https://github.com/saintedlama/passport-local-mongoose#api-documentation
userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);