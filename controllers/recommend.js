import Recommend from "../models/recommend.js";
import Books from "../models/books.js";

export const recommend = async (req, res) => {
    const {id, userId} = req.params;
    const recommend = new Recommend(req.body);
    recommend.owner = req.user._id; // userId and the req.user._id (is universally available thanks to passport) is same.
    await recommend.save();
    if(recommend._id) {
        req.flash('info', "To view your recommendations please visit the gallery page.");
        const foundBookToUpdate = await Books.findByIdAndUpdate(id, { $set: { recommended: true }}, { runValidators: true, new: true });
        await foundBookToUpdate.save();
    }
    req.flash('success', "Awesome!!! You have successfully recommmeded the book. Thank you for your contribution.")
    res.redirect(`/readingBliss/${id}`)
}