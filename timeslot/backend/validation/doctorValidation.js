const Joi = require('joi');

const createSlotSchema = Joi.object({
    doctorName: Joi.string().required().messages({
        'string.base': '"doctorName" should be a type of "text"',
        'any.required': '"doctorName" is a required field'
    }),
    date: Joi.date().iso().required().messages({
        'date.base': '"date" should be a valid date',
        'any.required': '"date" is a required field'
    }),
    startTime: Joi.number().integer().required().messages({
        'number.base': '"startTime" should be a number',
        'any.required': '"startTime" is a required field'
    }),
    endTime: Joi.number().integer().required().messages({
        'number.base': '"endTime" should be a number',
        'any.required': '"endTime" is a required field'
    }),
    interval: Joi.number().integer().min(1).required().messages({
        'number.base': '"interval" should be a number',
        'number.integer': '"interval" must be an integer',
        'number.min': '"interval" must be at least 1',
        'any.required': '"interval" is a required field'
    })
});

const viewDoctorSlotsSchema = Joi.object({
    doctorName: Joi.string().required().messages({
        'string.base': '"doctorName" should be a type of "text"',
        'any.required': '"doctorName" is a required field'
    }),
    date: Joi.date().iso().required().messages({
        'date.base': '"date" should be a valid date',
        'any.required': '"date" is a required field'
    })
});

const viewAllSlotsSchema = Joi.object({
    date: Joi.date().iso().required().messages({
        'date.base': '"date" should be a valid date',
        'any.required': '"date" is a required field'
    })
});

const bookSlotSchema = Joi.object({
    doctorName: Joi.string().required().messages({
        'string.base': '"doctorName" should be a type of "text"',
        'any.required': '"doctorName" is a required field'
    }),
    date: Joi.date().iso().required().messages({
        'date.base': '"date" should be a valid date',
        'any.required': '"date" is a required field'
    }),
    timeSlot: Joi.number().integer().required().messages({
        'number.base': '"timeSlot" should be a number',
        'any.required': '"timeSlot" is a required field'
    }),
    username: Joi.string().required().messages({
        'string.base': '"username" should be a type of "text"',
        'any.required': '"username" is a required field'
    })
});

const viewAllBookedAppointmentsSchema = Joi.object({
    doctorName: Joi.string().required().messages({
        'string.base': '"doctorName" should be a type of "text"',
        'any.required': '"doctorName" is a required field'
    }),
    date: Joi.date().iso().required().messages({
        'date.base': '"date" should be a valid date',
        'any.required': '"date" is a required field'
    })
});


module.exports = { createSlotSchema, viewDoctorSlotsSchema, viewAllSlotsSchema, bookSlotSchema };
