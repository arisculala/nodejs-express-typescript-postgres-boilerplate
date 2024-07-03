import { HttpStatusCode } from '../lib/httpstatus';

/**
 * Custom error class for standardized error handling.
 * Extends JavaScript's built-in Error class to provide additional properties
 * for error code, HTTP status, error message, details, and nested error handling.
 */
export class StandardError extends Error {
  /**
   * Error code associated with the specific error condition.
   */
  code: string;

  /**
   * HTTP status code representing the error response.
   */
  status: HttpStatusCode;

  /**
   * Error message describing the nature of the error.
   */
  message: string;

  /**
   * Optional additional details related to the error.
   */
  details?: [any];

  /**
   * Optional nested error object for more detailed error information.
   */
  error?: any;

  /**
   * Creates an instance of StandardError.
   * @param {Object} options - Options object containing error properties.
   * @param {string} options.code - Error code associated with the specific error condition.
   * @param {HttpStatusCode} options.status - HTTP status code representing the error response.
   * @param {string} options.message - Error message describing the nature of the error.
   * @param {[any]} options.details - Optional additional details related to the error.
   * @param {unknown} options.error - Optional nested error object for more detailed error information.
   */
  constructor({
    code,
    status,
    message,
    details,
    error,
  }: {
    code: string;
    status: HttpStatusCode;
    message: string;
    details?: [any];
    error?: unknown;
  }) {
    super();
    this.code = code;
    this.status = status;
    this.message = message;
    this.details = details;

    if (error instanceof Error) {
      // If error is an instance of Error, include its message in details
      this.details = [
        {
          message: error.message,
        },
      ];
    }
  }
}
