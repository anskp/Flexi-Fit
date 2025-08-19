// src/validators/dietValidator.js
import Joi from 'joi';
import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate({ ...req.body, ...req.params, ...req.query });
  if (error) {
    return next(new AppError(error.details.map((d) => d.message).join('; '), 400));
  }
  return next();
};

const cuidSchema = Joi.string().length(25).required();

export const createLogSchema = Joi.object({
  // ✅ RENAMED from foodName to match UI and new schema
  mealName: Joi.string().required(), 
  mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
  
  calories: Joi.number().integer().min(0).required(),
  protein: Joi.number().integer().min(0).optional().allow(null),
  carbs: Joi.number().integer().min(0).optional().allow(null),
  
  // ✅ RENAMED from fat to fats and changed to integer
  fats: Joi.number().integer().min(0).optional().allow(null), 
  
  // ✅ ADDED new fields from UI
  fiber: Joi.number().integer().min(0).optional().allow(null),
  sugar: Joi.number().integer().min(0).optional().allow(null),

  photoUrl: Joi.string().uri().optional().allow(null, ''),
  notes: Joi.string().optional().allow(null, ''),
  createdAt: Joi.date().iso().optional(), // Allow user to back-date a log
});

export const updateLogSchema = Joi.object({
    logId: cuidSchema.required(), // From params
    // All fields are optional for an update and match the new structure
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