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

// ✅ UPDATED: The log schema now accepts notes
const workoutLogSchema = Joi.object({
    exerciseId: cuidSchema.required(),
    sets: Joi.number().integer().min(0).optional().allow(null),
    reps: Joi.number().integer().min(0).optional().allow(null),
    weight: Joi.number().min(0).optional().allow(null),
    notes: Joi.string().optional().allow('', null), // Notes for a specific exercise
});

// ✅ UPDATED: The session schema now accepts all the new fields from your Prisma model
export const logSessionSchema = Joi.object({
  date: Joi.date().iso().optional(),
  
  // New WorkoutSession fields
  workoutName: Joi.string().required(), // e.g., 'Upper Body Push Day'
  workoutType: Joi.string().optional().allow('', null), // e.g., 'Strength Training'
  duration: Joi.number().integer().min(0).optional().allow(null), // in minutes
  intensity: Joi.string().valid('low', 'medium', 'high').optional().allow(null),
  notes: Joi.string().optional().allow('', null), // General notes for the session
  muscleGroups: Joi.array().items(Joi.string()).optional().allow(null), // Validates an array of strings
  equipment: Joi.array().items(Joi.string()).optional().allow(null), // Validates an array of strings
  
  // The list of exercises performed
  exercises: Joi.array().items(workoutLogSchema).min(1).required(),
});

// --- No changes needed for the schemas below ---

export const getHistorySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

export const sessionIdParamSchema = Joi.object({
    sessionId: cuidSchema.required(),
});

export default validate;