const Joi = require('joi');

module.exports.booksSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    author: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    images: Joi.string()    
}).required();