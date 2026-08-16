const BaseJoi = require('joi');

const htmlPattern = /(?:<[^>]+>|&(?:lt|gt|amp);|javascript:|on[a-z0-9-]+=)/i;


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                if (typeof value !== 'string') {
                    return value;
                }

                if (htmlPattern.test(value)) {
                    return helpers.error('string.escapeHTML', { value });
                }

                return value;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

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