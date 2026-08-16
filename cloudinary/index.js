const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadFile = {
    _handleFile(req, file, cb) {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'readingBliss',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    return cb(error);
                }

                file.path = result.secure_url;
                file.filename = result.public_id;
                cb(null, file);
            }
        );

        if (file.stream) {
            file.stream.pipe(uploadStream);
        } else {
            uploadStream.end(file.buffer);
        }
    },
    _removeFile(req, file, cb) {
        cb(null);
    }
};

module.exports = {
    cloudinary,
    uploadFile
};