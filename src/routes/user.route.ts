import express from 'express';
import {
  CreateUserRequestSchema,
  GetFilteredUsersRequestSchema,
  UpdateUserRequestSchema,
  UserIdParamSchema,
} from '../resources/user.resource';
import { ExpressValidation } from '../middlewares/express_validator.middleware';

import { app } from '../index';

/**
 * Router for user-related endpoints.
 * Provides routes for creating, retrieving, updating, and deleting users.
 */
const router = express.Router();

/**
 * POST /users
 * Endpoint to create a new user.
 * Validates the request body against CreateUserSchema using ExpressValidation middleware.
 * Routes the request to the createUser method of UserController.
 */
router.post(
  '/users',
  ExpressValidation({
    body: CreateUserRequestSchema,
  }),
  (req, res, next) => {
    app
      .get('userController')
      .createUser(req, res)
      .then(() => next());
  },
);

/**
 * GET /users
 * Endpoint to retrieve users based on filtering criteria.
 * Validates the request body against GetFilteredUsersParamSchema using ExpressValidation middleware.
 * Routes the request to the getFilteredUsers method of UserController.
 */
router.get(
  '/users',
  ExpressValidation({
    body: GetFilteredUsersRequestSchema,
  }),
  (req, res, next) => {
    app
      .get('userController')
      .getFilteredUsers(req, res)
      .then(() => next());
  },
);

/**
 * GET /users/:id
 * Endpoint to retrieve a user by ID.
 * Validates the request parameters against UserIdParamSchema using ExpressValidation middleware.
 * Routes the request to the getUser method of UserController.
 */
router.get(
  '/users/:id',
  ExpressValidation({
    params: UserIdParamSchema,
  }),
  (req, res, next) => {
    app
      .get('userController')
      .getUser(req, res)
      .then(() => next());
  },
);

/**
 * PATCH /users/:id
 * Endpoint to update a user by ID.
 * Validates the request parameters against UserIdParamSchema and request body against UpdateUserSchema using ExpressValidation middleware.
 * Routes the request to the updateUser method of UserController.
 */
router.patch(
  '/users/:id',
  ExpressValidation({
    params: UserIdParamSchema,
    body: UpdateUserRequestSchema,
  }),
  (req, res, next) => {
    app
      .get('userController')
      .updateUser(req, res)
      .then(() => next());
  },
);

/**
 * DELETE /users/:id
 * Endpoint to delete a user by ID.
 * Validates the request parameters against UserIdParamSchema using ExpressValidation middleware.
 * Routes the request to the deleteUser method of UserController.
 */
router.delete(
  '/users/:id',
  ExpressValidation({
    params: UserIdParamSchema,
  }),
  (req, res, next) => {
    app
      .get('userController')
      .deleteUser(req, res)
      .then(() => next());
  },
);

export default router;
