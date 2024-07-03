import Joi from 'joi';

/**
 * Schema for validating a user ID parameter.
 * Ensures the ID is a valid UUID.
 */
export const UserIdParamSchema = Joi.object({
  id: Joi.string().uuid().trim().required(),
});

/**
 * Schema for validating the creation of a new user.
 * Ensures required fields are provided and adhere to constraints.
 */
export const CreateUserRequestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
  username: Joi.string().min(10).required(),
  password: Joi.string().min(10).required(),
});

/**
 * Schema for validating the update of a user.
 * Ensures fields are optional but must adhere to constraints if provided.
 */
export const UpdateUserRequestSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().min(10).optional(),
  is2FaEnable: Joi.boolean().optional(),
  deleted: Joi.boolean().optional(),
});

/**
 * Schema for validating the parameters for filtering users.
 * Ensures pagination parameters are provided and valid, with optional filtering criteria.
 */
export const GetFilteredUsersRequestSchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(50).required(),
  deleted: Joi.boolean().optional(),
  is2FaEnable: Joi.boolean().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});
