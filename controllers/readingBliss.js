const Books = require('../models/books');
const Recommend = require('../models/recommend');
const { bookJson, galleryImages1, galleryImages2, galleryImages3, galleryImages4 } = require('../public/index');
module.exports.index = async (req, res) => {
    const booksLibrary = await Books.find({});
    let books;
    let bookLibrary = [];
    for(books of booksLibrary) {
        if(books.owner?.toString() === req.user._id?.toString()) {
            bookLibrary.push(books);
        }
    }
    res.render("readingBliss/index", { bookLibrary, bookJson });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("readingBliss/new", { bookJson })
}

module.exports.addNewBook = async (req, res) => {
    const newBook = await new Books(req.body);
    newBook.owner = req.user._id;
    await newBook.save();
    req.flash('success', "Book added successfully")
    res.redirect(`/readingBliss/${newBook._id}`)
}

module.exports.renderAboutUs = async (req, res) => {
    res.render("readingBliss/aboutUs", { bookJson });
}

module.exports.renderGallery = async (req, res) => {
    const books = await Books.find({});
    const recommendedList = await Recommend.find({});
    let recommendedBook =  [];
    for(let book of books ) {
        if(book.recommended && !recommendedList.length) {
            req.flash('error', "There are no recommended books at the moment. You can add the book by clicking on the recommended button from your collection.");
            const foundBookToUpdate = await Books.findByIdAndUpdate(book._id.toString(), { $set: { recommended: false }}, { runValidators: true, new: true });
            await foundBookToUpdate.save();
        } else if(book.recommended) {
            recommendedBook.push(book)
        }
    }

    // Explicitly declare four arrays
    let array1 = [];
    let array2 = [];
    let array3 = [];
    let array4 = [];

    // Store references to the target arrays
    let targetArrays = [array1, array2, array3, array4];

    // Distribute elements to the target arrays
    recommendedBook.forEach((item, index) => {
        let targetIndex = index % 4; // Since we have 4 arrays
        targetArrays[targetIndex].push(item);
    });

    let details1 = [], details2 = [], details3 = [], details4 = [];

    details1.push(array1);
    details2.push(array2);
    details3.push(array3);
    details4.push(array4);

    console.log(array1)

    res.render("readingBliss/gallery", { bookJson, recommendedBook, recommendedList, details1, details2, details3, details4 });

}

module.exports.renderContactUs = async (req, res) => {
    res.render("readingBliss/contact", { bookJson });
}

module.exports.renderDetailsPage = async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('owner');
    // console.log(foundBook,"----foundbook in details page");
    if(!foundBook) {
        req.flash('error', "Book you are searching for does not exists");
        return res.redirect('/readingBliss')
    }
    res.render("readingBliss/details", { foundBook, bookJson });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/edit", { book: foundBook, bookJson });
}

module.exports.editBooks = async (req, res) => {
    const { id } = req.params;
    await Books.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', "Book Updated successfully")
    res.redirect(`/readingBliss/${id}`);
}

module.exports.deleteBooks = async (req, res) => {
    const { id } = req.params;
    await Books.findByIdAndDelete(id);
    req.flash('success', "Book deleted successfully")
    res.redirect("/readingBliss");
}

