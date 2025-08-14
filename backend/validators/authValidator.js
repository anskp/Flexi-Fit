// src/validators/authValidator.js

import Joi from 'joi';
import AppError from '../utils/AppError.js';

// --- Reusable Validation Middleware ---
// This function takes a Joi schema and returns a middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // Report all errors at once
    stripUnknown: true, // Remove unknown properties from req.body
  });

  if (error) {
    // Collect all validation error messages
    const errorMessage = error.details.map((detail) => detail.message).join('; ');
    // Pass a structured error to the global error handler
    return next(new AppError(errorMessage, 400)); // 400 for Bad Request
  }

  return next();
};


// --- Schemas for Authentication Routes ---

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const adminRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  secretKey: Joi.string().required(),
});

// --- Schemas for Password Reset ---

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});


// --- Schemas for Role and Profile Creation (Protected Routes) ---

export const selectRoleSchema = Joi.object({
  role: Joi.string().uppercase().valid('MEMBER', 'GYM_OWNER', 'TRAINER', 'MULTI_GYM_MEMBER').required(),
});

export const createMemberProfileSchema = Joi.object({
  age: Joi.number().integer().min(13).max(100).required(),
  gender: Joi.string().required(),
  weight: Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  healthConditions: Joi.string().allow('').optional(),
  fitnessGoal: Joi.string().allow('').optional(),
});

const planSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  duration: Joi.string().required(), // e.g., "monthly", "yearly"
});

export const createTrainerProfileSchema = Joi.object({
  bio: Joi.string().required(),
  experience: Joi.number().integer().min(0).required(),
  gallery: Joi.array().items(Joi.string().uri()).optional(),
  plans: Joi.array().items(planSchema).min(1).required(),
});

export const createGymProfileSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  facilities: Joi.array().items(Joi.string()).optional(),
  plans: Joi.array().items(planSchema).min(1).required(),
});

export const createMultiGymProfileSchema = Joi.object({
  // Assuming these are your tiers, adjust as needed
  tier: Joi.string().uppercase().valid('GOLD', 'PLATINUM', 'DIAMOND').required(),
});


// Export the middleware itself
export default validate;
