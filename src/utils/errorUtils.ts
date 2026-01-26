// ===========================================
// ERROR UTILITIES - Mood Tracker
// ===========================================

/**
 * Pydantic validation error structure from FastAPI
 */
interface PydanticValidationError {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: unknown;
  ctx?: Record<string, unknown>;
}

/**
 * API error response structure
 */
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
 * @param error - The caught error object
 * @param fallback - Fallback message if extraction fails
 * @returns A string error message safe for rendering
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string = 'An unexpected error occurred'
): string {
  const apiError = error as ApiErrorResponse;
  const detail = apiError?.response?.data?.detail;

  // Handle string error messages
  if (typeof detail === 'string') {
    return detail;
  }

  // Handle Pydantic validation error arrays
  if (Array.isArray(detail) && detail.length > 0) {
    // Get the first validation error's message
    const firstError = detail[0];
    if (firstError && typeof firstError.msg === 'string') {
      return firstError.msg;
    }
  }

  // Return fallback for other cases
  return fallback;
}
