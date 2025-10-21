import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import { ErrorResponse } from '../types/interfaces';
import { isDevelopment } from '../config/environment';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
  } else if (err instanceof MongooseError.CastError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if ((err as any).code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys((err as any).keyPattern)[0];
    message = `${field} already exists`;
  }

  if (message.includes('not found')) {
    statusCode = HTTP_STATUS.NOT_FOUND;
  } else if (message.includes('already exists')) {
    statusCode = HTTP_STATUS.CONFLICT;
  } else if (
    message.includes('Invalid') ||
    message.includes('must be') ||
    message.includes('required')
  ) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: err.name || 'Error',
    message,
    statusCode,
  };

  if (isDevelopment()) {
    (errorResponse as any).stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: HTTP_STATUS.NOT_FOUND,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
