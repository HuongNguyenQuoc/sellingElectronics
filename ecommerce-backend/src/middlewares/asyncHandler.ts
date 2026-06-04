import { RequestHandler } from 'express';

export const asyncHandler = <T extends RequestHandler>(fn: T): T =>
  ((req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)) as T;
