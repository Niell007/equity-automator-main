export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SUPABASE_ERROR: 'SUPABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle Supabase errors
    if ('code' in error && typeof error.code === 'string') {
      return new AppError(
        error.message,
        ErrorCodes.SUPABASE_ERROR,
        500,
        { originalError: error }
      );
    }

    // Handle network errors
    if (error.name === 'NetworkError') {
      return new AppError(
        'Network error occurred',
        ErrorCodes.NETWORK_ERROR,
        503,
        { originalError: error }
      );
    }

    // Handle other known errors
    return new AppError(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      500,
      { originalError: error }
    );
  }

  // Handle unknown errors
  return new AppError(
    'An unexpected error occurred',
    ErrorCodes.UNKNOWN_ERROR,
    500,
    { originalError: error }
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
} 