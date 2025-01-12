const express = require('express');
const router = express.Router({mergeParams: true});
const { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 } = require('../public/index');
const Recommend = require('../models/recommend')
const Books = require('../models/books')

// router.get('/', async (req, res) => {
//     res.render("readingBliss/gallery", { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 });
// })

router.post('/:id/recommend/:userId', async (req, res) => {
    const {id, userId} = req.params;
    const recommend = new Recommend(req.body);
    recommend.owner = req.user._id; // userId and the req.user._id (is universally available thanks to passport) is same.
    await recommend.save();
    if(recommend._id) {
        req.flash('info', "To view your recommendations please visit the gallery page.");
        const foundBook = await Books.findByIdAndUpdate(id, { $set: { recommended: true }}, { runValidators: true, new: true });
        await foundBook.save();
    }
    req.flash('success', "Awesome!!! You ahve successfully recommmeded the book. Thank you for your contribution.")
    console.log(req.body, "------coneole body")
    res.redirect(`/readingBliss/${id}`)
})

module.exports = router;