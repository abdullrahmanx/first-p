const joi=require('joi')
const AppError = require('../utils/AppError')

const signUpSchema=joi.object({
    name: joi.string().min(3).max(20).required().label('Name').messages({
        "string.empty": "Name is required",
        "string.min": "Name must be atleast 3 characters",
        "any.required": "Name is required"
    }),
    email: joi.string().email().required().label('Email').messages({
        "string.email": "Please provide a valid email",
        "string.empty": "Email is required"
    }),
    password: joi.string().min(6).required().label('Password').messages({
        "string.empty": "Password is required",
        "string.min": "Password must be atleast 6 characters",
        "any.required": "Password is required"
    })
})
const loginSchema= joi.object({
    email: joi.string().email().required().label('Email').messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required"
    }),
    password: joi.string().min(6).required().label('Password').messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required"
    })
})
const validate= (schema) => {
    return (req,res,next) => {
        const {error} =schema.validate(req.body,{ abortEarly: false})
        if(error) {
            const errors= error.details.map((err) => err.message)
            return next(new AppError('Error',400,errors))
        }
        next();
    }
}
module.exports= {
    signupValidator: validate(signUpSchema),
    loginValdiator: validate(loginSchema)
}