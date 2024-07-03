/**
 * UserController class
 * Handles CRUD operations for users.
 */

import { Request, Response } from 'express';
import { HttpStatusCode } from '../lib/httpstatus';
import ControllerErrorHandler from '../utils/controller_error_handler';
import UserService from '../services/user.service';

class UserController {
  private userService;

  /**
   * Constructs a new instance of the UserController.
   * @param {UserService} userService - The user service instance to use for handling user-related operations.
   */
  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Handles the creation of a new user.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(HttpStatusCode.Created).json(user);
    } catch (error) {
      ControllerErrorHandler.handleErrorResponse(res, error);
    }
  }

  /**
   * Handles retrieving a user by ID.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUser(req.params.id);
      res.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      ControllerErrorHandler.handleErrorResponse(res, error);
    }
  }

  /**
   * Handles retrieving users based on specific filters.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  async getFilteredUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getFilteredUsers(req.body);
      res.json(users);
    } catch (error: unknown) {
      ControllerErrorHandler.handleErrorResponse(res, error);
    }
  }

  /**
   * Handles updating a user by ID.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body,
      );
      res.json(updatedUser);
    } catch (error: unknown) {
      ControllerErrorHandler.handleErrorResponse(res, error);
    }
  }

  /**
   * Handles deleting a user by ID.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const isUserDeleted = await this.userService.deleteUser(req.params.id);
      res.json(isUserDeleted);
    } catch (error: unknown) {
      ControllerErrorHandler.handleErrorResponse(res, error);
    }
  }
}

export default UserController;
