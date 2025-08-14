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
  mealType: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snack').required(),
  foodName: Joi.string().required(),
  photoUrl: Joi.string().uri().optional().allow(null, ''),
  calories: Joi.number().integer().min(0).required(),
  protein: Joi.number().min(0).optional().allow(null),
  carbs: Joi.number().min(0).optional().allow(null),
  fat: Joi.number().min(0).optional().allow(null),
  createdAt: Joi.date().iso().optional(), // Allow user to back-date a log
});

export const updateLogSchema = Joi.object({
    logId: cuidSchema.required(), // From params
    // All fields are optional for an update
    mealType: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snack').optional(),
    foodName: Joi.string().optional(),
    photoUrl: Joi.string().uri().optional().allow(null, ''),
    calories: Joi.number().integer().min(0).optional(),
    protein: Joi.number().min(0).optional().allow(null),
    carbs: Joi.number().min(0).optional().allow(null),
    fat: Joi.number().min(0).optional().allow(null),
    createdAt: Joi.date().iso().optional(),
});

export const getLogsByDateSchema = Joi.object({
  // YYYY-MM-DD format
  date: Joi.string().isoDate().required(),
});

export const logIdParamSchema = Joi.object({
    logId: cuidSchema.required(),
});


export default validate;

