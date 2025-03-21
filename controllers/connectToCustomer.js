const ConnectToCustomer = require('../models/connectToCustomer');

module.exports.submitRequest = async (req, res) => {
    try {
        const {customerEmailId, customerName, customerMessage} = req.body;
        const newRequest = await new ConnectToCustomer({customerName, customerEmailId, customerMessage});
        newRequest.save()
        req.flash('success', "Thanks for visiting ReadingBliss! We're excited to connect with fellow book lovers. We will get get back to your message.")
        res.redirect(`/readingBliss/contact`);
    } catch (err) {
        req.flash('error', "Looks like we did not receive the message. There could be some problem. Please try again!!")
        res.redirect(`/readingBliss/contact`);
    }
}