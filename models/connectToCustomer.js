import mongoose from "mongoose";

const connectToCustomerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        unique: false
    },
    customerEmailId: {
        type: String,
        required: true,
        unique: false
    },
    customerMessage: {
        type: String,
        required: true,
        unique: false
    }
})

const ConnectToCustomerModel = mongoose.model('ConnectToCustomer', connectToCustomerSchema);

export default ConnectToCustomerModel;
