const BaseJoi = require('joi');
// const { type } = require('os');
const sanitize = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitize(value, {
                    allowedTages: [],
                    allowedAttributes: {}
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                    return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.booksSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    author: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    category: Joi.string().required().escapeHTML()
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required() 
    }).required()
})

//     price: Joi.number().required().min(0),