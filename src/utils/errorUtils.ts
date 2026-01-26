
interface PydanticValidationError {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: unknown;
  ctx?: Record<string, unknown>;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      detail?: string | PydanticValidationError[];
    };
  };
}

/**
 * Extract a user-friendly error message from an API error response.
 * Handles both string errors and Pydantic validation error arrays.
 * 
 * @param error
 * @param fallback
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string = 'An unexpected error occurred'
): string {
  const apiError = error as ApiErrorResponse;
  const detail = apiError?.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const firstError = detail[0];
    if (firstError && typeof firstError.msg === 'string') {
      return firstError.msg;
    }
  }

  return fallback;
}
