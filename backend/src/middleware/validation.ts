import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(d => d.message);
      res.status(400).json({ errors: messages });
      return;
    }

    req.body = value;
    next();
  };
};

export const schemas = {
  createChat: Joi.object({
    participantId: Joi.string().required(),
    type: Joi.string().valid('private', 'secret'),
  }),
  createGroup: Joi.object({
    name: Joi.string().min(1).required(),
    participants: Joi.array().items(Joi.string()).min(2).required(),
    avatar: Joi.string(),
  }),
  sendMessage: Joi.object({
    chatId: Joi.string().required(),
    type: Joi.string().required(),
    content: Joi.string(),
    mediaUrl: Joi.string(),
  }),
};