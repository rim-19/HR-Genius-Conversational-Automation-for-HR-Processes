export class AppError extends Error {
  public readonly statusCode: number;
  public readonly stage?: string;
  public readonly isOperational: boolean;
  // When true, this error is meant to be spoken back to the user as a normal
  // assistant message (a clarification or correction), NOT surfaced as a failure.
  public readonly isConversational: boolean;

  constructor(message: string, statusCode: number = 500, stage?: string, isConversational: boolean = false) {
    super(message);

    this.statusCode = statusCode;
    this.stage = stage;
    this.isOperational = true;
    this.isConversational = isConversational;

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

  // A user-facing clarification/correction. Carried up the pipeline and returned
  // as a friendly assistant message (HTTP 200) instead of an error response.
  static conversational(message: string, stage?: string): AppError {
    return new AppError(message, 200, stage, true);
  }
}
