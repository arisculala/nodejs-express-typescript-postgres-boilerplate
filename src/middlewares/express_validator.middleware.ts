/**
 * Express middleware for request validation.
 */
import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationResult } from 'joi';
import { HttpStatusCode } from '../lib/httpstatus';

/**
 * Define a type for the validation schemas.
 */
interface ValidationSchemas {
  body?: Joi.Schema;
  headers?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}

const BAD_REQUEST_MESSAGE = 'Bad Request: Validation error';

/**
 * Middleware function to validate Express requests based on provided schemas.
 * @param {ValidationSchemas} schemas - An object containing Joi schemas for body, headers, query, and params.
 * @returns {Function} - The middleware function.
 */
export const ExpressValidation =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Validate request body if schema is provided
    if (schemas.body) {
      const bodyValidationResult: ValidationResult = schemas.body.validate(
        req.body,
      );
      if (bodyValidationResult.error) {
        return res.status(HttpStatusCode.BadRequest).json({
          status: HttpStatusCode.BadRequest,
          message: BAD_REQUEST_MESSAGE,
          details: bodyValidationResult.error.details,
        });
      }
    }

    // Validate request headers if schema is provided
    if (schemas.headers) {
      const headersValidationResult: ValidationResult =
        schemas.headers.validate(req.headers);
      if (headersValidationResult.error) {
        return res.status(HttpStatusCode.BadRequest).json({
          status: HttpStatusCode.BadRequest,
          message: BAD_REQUEST_MESSAGE,
          details: headersValidationResult.error.details,
        });
      }
    }

    // Validate request query if schema is provided
    if (schemas.query) {
      const queryValidationResult: ValidationResult = schemas.query.validate(
        req.query,
      );
      if (queryValidationResult.error) {
        return res.status(HttpStatusCode.BadRequest).json({
          status: HttpStatusCode.BadRequest,
          message: BAD_REQUEST_MESSAGE,
          details: queryValidationResult.error.details,
        });
      }
    }

    // Validate request params if schema is provided
    if (schemas.params) {
      const paramsValidationResult: ValidationResult = schemas.params.validate(
        req.params,
      );
      if (paramsValidationResult.error) {
        return res.status(HttpStatusCode.BadRequest).json({
          status: HttpStatusCode.BadRequest,
          message: BAD_REQUEST_MESSAGE,
          details: paramsValidationResult.error.details,
        });
      }
    }

    next(); // Move to the next middleware
  };
