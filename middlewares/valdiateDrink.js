const Joi = require('joi');
const AppError = require('../utils/AppError');

const drinkSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters long',
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    price: Joi.number().positive().min(10).required().messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be a positive number',
        'number.min': 'Price must be at least 10',
        'any.required': 'Price is required'
    }),
    inStock: Joi.boolean().required().messages({
        'boolean.base': 'Must be a boolean value',
        'any.required': 'inStock is required'
    })
});

function validateDrink(req, res, next) {
    const { error } = drinkSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(err => err.message);
        return next(new AppError('Fail', 400, errors));
    }
    next();
}

module.exports = validateDrink;