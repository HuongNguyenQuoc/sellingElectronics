import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../common/exceptions/AppError';
import { User, IUser } from '../models/User';
import { HydratedDocument } from 'mongoose';
// Extend the Request interface to include user property for Request with user information
export interface AuthRequest extends Request {
  user?: HydratedDocument<IUser>;
}

// This middleware will protect routes that require authentication by verifying the JWT token
// and attaching the user information to the request object.
const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return next(new AppError(401, 'No token, authorization denied'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      // because jwt.verify return type is string / object so we need to cast it to the type we want

      // Fetch user to attach to request
      const user = await User.findById(decoded.id).select('-password'); // The minus sign means we don't want to include the password field in the user object
      if (!user) {
        return next(new AppError(401, 'User no longer exists'));
      }

      req.user = user;
      return next(); // This means the user is authenticated and we can proceed to the next middleware or route handler
      
    } catch (error) {
      return next(new AppError(401, 'Token is not valid'));
    }
  }
  return next(new AppError(401, 'No token, authorization denied'));
};

const admin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return next(new AppError(403, 'Admin access required'));
  }
};

export { admin, protect };
