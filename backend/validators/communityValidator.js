// src/validators/communityValidator.js
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

export const postContentSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
});

export const commentContentSchema = Joi.object({
  content: Joi.string().trim().min(1).required(),
});

export const postIdParamSchema = Joi.object({
  postId: cuidSchema.label('Post ID'),
});

export const commentIdParamSchema = Joi.object({
  commentId: cuidSchema.label('Comment ID'),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

export default validate;

