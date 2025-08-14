// src/validators/workoutValidator.js
import Joi from 'joi';
import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate({ ...req.body, ...req.query, ...req.params });
  if (error) {
    return next(new AppError(error.details.map((d) => d.message).join('; '), 400));
  }
  return next();
};

const cuidSchema = Joi.string().length(25).required();

const workoutLogSchema = Joi.object({
    exerciseId: cuidSchema.required(),
    sets: Joi.number().integer().min(0).optional().allow(null),
    reps: Joi.number().integer().min(0).optional().allow(null),
    weight: Joi.number().min(0).optional().allow(null),
    duration: Joi.number().integer().min(0).optional().allow(null) // in minutes
});

export const logSessionSchema = Joi.object({
  date: Joi.date().iso().optional(),
  exercises: Joi.array().items(workoutLogSchema).min(1).required(),
});

export const getHistorySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

export const sessionIdParamSchema = Joi.object({
    sessionId: cuidSchema.required(),
});

export default validate;

