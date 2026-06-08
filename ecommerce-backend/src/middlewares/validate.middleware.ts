import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../common/exceptions/AppError';

export const validate = (schema: z.ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Valide body, query, params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next(); // Data validate, go on middleware/controller
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            400,
            'Validation failed',
            error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            }))
          )
        );
      }
      return next(error);
    }
  };
};
