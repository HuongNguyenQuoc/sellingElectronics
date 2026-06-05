import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Extend the Request interface to include user property for Request with user information
export interface AuthRequest extends Request {
  user?: any;
}

// This middleware will protect routes that require authentication by verifying the JWT token
// and attaching the user information to the request object.
const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      // because jwt.verify return type is string / object so we need
      // to cast it to the type we want

      // Fetch user to attach to request
      req.user = await User.findById(decoded.id).select('-password'); // The minus sign means we don't want to include the password field in the user object
      next(); // This means the user is authenticated and we can proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: "Token is not valid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};

export { protect, admin };