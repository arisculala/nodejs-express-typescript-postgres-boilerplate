import { Response } from 'express';
import { HttpStatusCode, HttpStatusName } from '../lib/httpstatus';
import { StandardError } from './standard_error';

// Define an interface for the error object
interface ErrorResponse {
  code: string;
  status: HttpStatusCode;
  message: string;
  details?: any;
}

/**
 * Utility class to handle custom controller error responses.
 * Provides a centralized mechanism to format and send error responses to clients.
 */
class ControllerErrorHandler {
  /**
   * Handle error responses based on the provided error object.
   * @param {Response} res - The Express response object to send the response.
   * @param {any} error - The error object to handle.
   */
  static handleErrorResponse(res: Response, error: any): void {
    let errorResponse: ErrorResponse;

    // Check if the error is a StandardError (custom error)
    if (error instanceof StandardError) {
      errorResponse = {
        code: error.code,
        status: error.status,
        message: error.message,
        details: error.details,
      };
    } else {
      // If the error is not a StandardError, treat it as a generic server error
      errorResponse = {
        code: HttpStatusName[HttpStatusCode.InternalServerError],
        status: HttpStatusCode.InternalServerError,
        message:
          'The server encountered an error and could not complete your request.',
        details: error.message,
      };
    }

    // Send the formatted error response with appropriate HTTP status code
    res.status(errorResponse.status).json(errorResponse);
  }
}

export default ControllerErrorHandler;
