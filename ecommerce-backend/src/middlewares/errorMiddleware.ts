import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../common/exceptions/AppError';

export const notFound: RequestHandler = (req, res, next): void => {
  const error = new AppError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  const statusCode = err.statusCode ?? (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message,
    ...(err.errors ? { errors: err.errors } : {}),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
