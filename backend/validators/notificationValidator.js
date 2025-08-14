import Joi from 'joi';
import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate({ ...req.body, ...req.params });
  if (error) return next(new AppError(error.details.map((d) => d.message).join('; '), 400));
  return next();
};

export const registerTokenSchema = Joi.object({
    token: Joi.string().required(),
});

export const sendGymNotificationSchema = Joi.object({
    gymId: Joi.string().length(25).required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
});

export default validate;
