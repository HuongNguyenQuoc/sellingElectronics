import { RequestHandler } from 'express';

export const asyncHandler = <T extends RequestHandler>(fn: T): T => // This returns a new Express controller.
  ((req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)) as T;
  // Promise.resolve(fn(req, res, next)) this runs your controller;
  // Promise.resolve(...) makes sure the result is treated like a Promise.
