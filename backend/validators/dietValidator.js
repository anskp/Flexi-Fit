// // src/validators/dietValidator.js

import Joi from 'joi';
import AppError from '../utils/AppError.js';

// This is the new, more robust validation middleware function.
// It specifically validates req.body and strips any fields not in the schema.
const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false, // Report all errors at once, not just the first one
    stripUnknown: true, // THIS IS THE KEY: It removes fields like 'token' from the body
  };

  // We only validate the request body against the schema
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    // If validation fails, create a clear error message and stop the request
    const errorMessages = error.details.map((d) => d.message).join('; ');
    console.error("❌ Validation Failed:", errorMessages);
    return next(new AppError(errorMessages, 400));
  }

  // IMPORTANT: Overwrite req.body with the validated and stripped data.
  // This ensures the controller is clean and safe.
  req.body = value;
  return next();
};

// Your Joi schemas. These define the "rules" for your data.
const cuidSchema = Joi.string().length(25).required();

export const createLogSchema = Joi.object({
  // This schema now matches what the frontend will send
  mealName: Joi.string().required(),
  mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
  calories: Joi.number().integer().min(0).required(),
  protein: Joi.number().integer().min(0).optional().allow(null),
  carbs: Joi.number().integer().min(0).optional().allow(null),
  fats: Joi.number().integer().min(0).optional().allow(null),
  fiber: Joi.number().integer().min(0).optional().allow(null),
  sugar: Joi.number().integer().min(0).optional().allow(null),
  photoUrl: Joi.string().uri().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
  createdAt: Joi.date().iso().optional(),
});

export const updateLogSchema = Joi.object({
  logId: cuidSchema.required(),
  mealName: Joi.string().optional(),
  mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').optional(),
  calories: Joi.number().integer().min(0).optional(),
  protein: Joi.number().integer().min(0).optional().allow(null),
  carbs: Joi.number().integer().min(0).optional().allow(null),
  fats: Joi.number().integer().min(0).optional().allow(null),
  fiber: Joi.number().integer().min(0).optional().allow(null),
  sugar: Joi.number().integer().min(0).optional().allow(null),
  photoUrl: Joi.string().uri().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
  createdAt: Joi.date().iso().optional(),
});

export const getLogsByDateSchema = Joi.object({
  date: Joi.string().isoDate().required(),
});

export const logIdParamSchema = Joi.object({
  logId: cuidSchema.required(),
});

export default validate;