import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Forbidden! You do not have permission.');
    }
    next();
  };
};
