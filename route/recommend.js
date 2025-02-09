const express = require('express');
const router = express.Router({mergeParams: true});
const { wrapAsync, isLoggedIn, isOwner } = require('../utils');
const recommendController = require('../controllers/recommend')

// router.get('/', async (req, res) => {
//     res.render("readingBliss/gallery", { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 });
// })

router.post('/:id/recommend/:userId',isLoggedIn,isOwner, wrapAsync(recommendController.recommend))

module.exports = router;