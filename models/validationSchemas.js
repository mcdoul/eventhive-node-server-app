import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Invalid type, name must be a string',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'Invalid type, email must be a string',
    'string.email': 'Please input a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Invalid type, password must be a string',
    'string.min': 'The minimum length of the password is 8',
    'any.required': 'Password is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'Invalid type, email must be a string',
    'string.email': 'Please include a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Invalid type, password must be a string',
    'any.required': 'Password is required',
  }),
  isAdministrator: Joi.bool().required().messages({
    'any.required': 'isAdministrator is required',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'Invalid type, email must be a string',
    'string.email': 'Please input a valid email',
    'any.required': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'Invalid type, email must be a string',
    'string.email': 'Please input a valid email',
    'any.required': 'Email is required',
  }),
  validationCode: Joi.string().required().messages({
    'string.base': 'Invalid type, validationCode must be a string',
    'any.required': 'Validation code is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Invalid type, password must be a string',
    'string.min': 'The minimum length of the password is 8',
    'any.required': 'Password is required',
  }),
});
