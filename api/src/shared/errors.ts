/**
 * Normalized API errors — never expose raw DB errors to client.
 * Code: SCREAMING_SNAKE_CASE per TechSpec 1.4.
 */

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: object
  ) {
    super(code);
    this.name = 'AppError';
  }
}

export function errorResponse(
  code: string,
  statusCode: number,
  message: string,
  details?: object,
  requestId?: string
) {
  return {
    success: false as const,
    code,
    message,
    ...(details && { details }),
    ...(requestId && { requestId }),
  };
}
