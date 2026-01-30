export class AppError extends Error {
  public readonly statusCode: number;
  public readonly stage?: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, stage?: string) {
    super(message);
    
    this.statusCode = statusCode;
    this.stage = stage;
    this.isOperational = true;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    // Set the name explicitly for better debugging
    this.name = 'AppError';
  }

  // Static factory methods for common error types
  static badRequest(message: string, stage?: string): AppError {
    return new AppError(message, 400, stage);
  }

  static unauthorized(message: string = 'Unauthorized', stage?: string): AppError {
    return new AppError(message, 401, stage);
  }

  static forbidden(message: string, stage?: string): AppError {
    return new AppError(message, 403, stage);
  }

  static notFound(message: string = 'Resource not found', stage?: string): AppError {
    return new AppError(message, 404, stage);
  }

  static internal(message: string = 'Internal server error', stage?: string): AppError {
    return new AppError(message, 500, stage);
  }

  static validation(message: string, stage?: string): AppError {
    return new AppError(message, 400, stage);
  }
}
