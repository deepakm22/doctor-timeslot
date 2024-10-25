const Joi = require('joi')

const registerValidationSchema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be less than 50 characters long',
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required'
    }),
    role: Joi.string().valid('patient', 'doctor').default('patient').messages({
        'any.only': 'Role must be either patient or doctor'
    })
});

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    })
});

module.exports = { registerValidationSchema, loginValidationSchema }