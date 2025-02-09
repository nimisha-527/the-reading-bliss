const Books = require('../models/books');
const Recommend = require('../models/recommend');
const { bookJson, icons } = require('../public');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const booksLibrary = await Books.find({});
    let books;
    let bookLibrary = [];
    const booksListStatic = bookJson.listOfBooks; 
    for(books of booksLibrary) {
        if(books.owner?.toString() === req.user._id?.toString()) {
            bookLibrary.push(books);
        }
    }
    res.render("readingBliss/index", { bookLibrary, booksListStatic, icons, bookJson });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("readingBliss/new", { bookJson, icons })
}

module.exports.addNewBook = async (req, res) => {
    const newBook = await new Books(req.body);
    newBook.images = req.files.map((f) => {
        return {
            url: f.path,
            filename: f.filename
        }
    });
    newBook.owner = req.user._id;
    await newBook.save();

    // If the user does not select the images section then we update default image.
    if(newBook.images.length == 0) {
        const imgs = {
            url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1798&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "YourBook"
        }
        newBook.images.push(imgs)
        await newBook.save();
    }
    req.flash('success', "Book added successfully")
    res.redirect(`/readingBliss/${newBook._id}`)
}

module.exports.renderAboutUs = async (req, res) => {
    const aboutUsStatic = bookJson.aboutUs;
    res.render("readingBliss/aboutUs", { aboutUsStatic, bookJson, icons });
}

module.exports.renderGallery = async (req, res) => {
    const books = await Books.find({});
    const recommendedList = await Recommend.find({});
    const galleryStatic = bookJson.gallery;
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

    res.render("readingBliss/gallery", { galleryStatic, recommendedBook, recommendedList, details1, details2, details3, details4, icons, bookJson });

}

module.exports.renderContactUs = async (req, res) => {
    const contactUsStatic = bookJson.contactUs;
    res.render("readingBliss/contact", { contactUsStatic, bookJson, icons });
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
    const staticDetails = bookJson.details;
    res.render("readingBliss/details", { foundBook, icons, staticDetails, bookJson });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundBook = await Books.findById(id);
    res.render("readingBliss/edit", { book: foundBook, bookJson, icons });
}

module.exports.editBooks = async (req, res) => {
    const { id } = req.params;
    const books = await Books.findById(id);
    const updateBooks = await Books.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    updateBooks.images = req.files.map((f) => {
        return {
            url: f.path,
            filename: f.filename
        }
    });
    await updateBooks.save();

    // If the user does not select the images section then we do not change the image and update the same image again that he has already selected.
    if(updateBooks.images.length === 0) {
        updateBooks.images = books.images?.map((f) => {
            return {
                url: f.url,
                filename: f.filename
            }
        });
        await updateBooks.save();
    }
    req.flash('success', "Book Updated successfully")
    res.redirect(`/readingBliss/${id}`);
}

module.exports.deleteBooks = async (req, res) => {
    const { id } = req.params;
    const deleteBooks = await Books.findByIdAndDelete(id);
    for(let image of deleteBooks.images) {
        await cloudinary.uploader.destroy(image.filename)
    }
    req.flash('success', "Book deleted successfully")
    res.redirect("/readingBliss");
}

