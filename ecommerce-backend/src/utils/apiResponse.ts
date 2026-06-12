import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message = 'Success'
) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendJson = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json(data);
};
