import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let stage: string | undefined;

  // Handle known AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stage = err.stage;
  } else {
    // Handle unknown errors - don't expose stack traces
    logger.error({ err }, 'UNKNOWN ERROR');

    // Try to extract useful info from unknown errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation error';
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid data format';
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    } else if (err.message.includes('ENOENT')) {
      statusCode = 404;
      message = 'Resource not found';
    } else if (err.message.includes('EACCES')) {
      statusCode = 403;
      message = 'Permission denied';
    }
  }

  // Always return consistent error format
  const errorResponse: any = {
    success: false,
    message
  };

  // Add stage if available
  if (stage) {
    errorResponse.stage = stage;
  }

  // Log error for debugging (but don't expose to client)
  if (!(err instanceof AppError) || err.statusCode >= 500) {
    logger.error(
      {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        user: (req as any).user,
      },
      'ERROR DETAILS'
    );
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper to catch promise rejections
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
