const Joi = require('joi');

module.exports.booksSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required()
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required() 
    }).required()
})

//     price: Joi.number().required().min(0),