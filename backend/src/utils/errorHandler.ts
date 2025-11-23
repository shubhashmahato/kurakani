export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Async error handler wrapper
 */
export const catchAsync = (fn: any) => {
  return (...args: any[]) => {
    return Promise.resolve(fn(...args)).catch(args[args.length - 1]);
  };
};

/**
 * Get error message
 */
export const getErrorMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unexpected error occurred';
  }
};

/**
 * Get error status code
 */
export const getErrorStatusCode = (error: any): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  } else if (error.statusCode) {
    return error.statusCode;
  } else {
    return 500;
  }
};

/**
 * Common errors
 */
export const Errors = {
  NOT_FOUND: (resource: string) =>
    new AppError(`${resource} not found`, 404, 'NOT_FOUND'),

  UNAUTHORIZED: () =>
    new AppError('Unauthorized access', 401, 'UNAUTHORIZED'),

  FORBIDDEN: (action: string) =>
    new AppError(`You are not allowed to ${action}`, 403, 'FORBIDDEN'),

  BAD_REQUEST: (message: string) =>
    new AppError(message, 400, 'BAD_REQUEST'),

  CONFLICT: (resource: string) =>
    new AppError(`${resource} already exists`, 409, 'CONFLICT'),

  UNPROCESSABLE_ENTITY: (field: string) =>
    new AppError(`Invalid ${field}`, 422, 'UNPROCESSABLE_ENTITY'),

  INTERNAL_SERVER_ERROR: () =>
    new AppError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'),

  INVALID_TOKEN: () =>
    new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'),

  RATE_LIMIT_EXCEEDED: () =>
    new AppError('Too many requests, please try again later', 429, 'RATE_LIMIT_EXCEEDED'),

  SERVICE_UNAVAILABLE: () =>
    new AppError('Service temporarily unavailable', 503, 'SERVICE_UNAVAILABLE'),
};