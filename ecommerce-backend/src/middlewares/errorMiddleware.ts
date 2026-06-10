import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../common/exceptions/AppError';

export const notFound: RequestHandler = (req, res, next): void => {
  const error = new AppError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next): void => {
  const statusCode = err.statusCode ?? (res.statusCode === 200 ? 500 : res.statusCode);
  /*
  ??

  This is called nullish coalescing operator.
  It means:
  Use the right side only if the left side is null or undefined.
  
  */
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message,
    ...(err.errors ? { errors: err.errors } : {}),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/*
Unknown route
→ notFound
→ create AppError(404)
→ next(error)
→ errorHandler
→ send JSON response
*/
