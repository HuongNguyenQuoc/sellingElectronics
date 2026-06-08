import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';
import { AppError } from '../common/exceptions/AppError';

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'Not authenticated.'))
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden! You do not have permissions.'));
    }
    return next();
  };
};
