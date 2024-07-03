import { v4 as uuidv4 } from 'uuid';
import { StandardError } from '../utils/standard_error';
import { HttpStatusCode } from '../lib/httpstatus';
import UserRepository from '../repositories/user.repository';
import {
  FindUsersFilter,
  FilteredListUsers,
  NewUser,
  UserErrorCode,
  UserEntity,
} from '../interfaces/user.interface';
import { SuccessResponse } from '../interfaces/common.interface';

/**
 * Service class for handling user-related business logic.
 * Encapsulates operations for creating, retrieving, updating, and deleting users.
 */
class UserService {
  /**
   * Create a new user.
   * @param {NewUser} newUser - The new user data.
   * @returns {Promise<UserEntity>} - The created user entity.
   * @throws {StandardError} - Throws an error if user creation fails.
   */
  async createUser(newUser: NewUser): Promise<UserEntity> {
    try {
      const userToInsert: UserEntity = {
        id: uuidv4(),
        ...newUser,
        deleted: false,
        is2FaEnable: false,
      };
      return await UserRepository.insert(userToInsert);
    } catch (error) {
      throw new StandardError({
        code: UserErrorCode.CREATE_NEW_USER_ERROR,
        message: `Error creating new user`,
        status: HttpStatusCode.InternalServerError,
        error: error,
      });
    }
  }

  /**
   * Get a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserEntity>} - The retrieved user entity.
   * @throws {StandardError} - Throws an error if user retrieval fails.
   */
  async getUser(id: string): Promise<UserEntity> {
    const user = await UserRepository.findOneById(id);
    if (!user) {
      throw new StandardError({
        code: UserErrorCode.USER_NOT_FOUND_ERROR,
        message: `User with id ${id} not found.`,
        status: HttpStatusCode.NotFound,
      });
    }
    return user;
  }

  /**
   * Get users based on filtering criteria.
   * @param {FindUsersFilter} filter - The filter criteria.
   * @returns {Promise<ListUsers>} - An object containing paginated users.
   * @throws {Error} - Throws an error if user retrieval fails.
   */
  async getFilteredUsers(filter: FindUsersFilter): Promise<FilteredListUsers> {
    const filteredUsers = await UserRepository.findFiltered(filter);
    return filteredUsers;
  }

  /**
   * Update a user by ID with the given data.
   * @param {string} id - The ID of the user to update.
   * @param {UserEntity} updatedUser - The updated user data.
   * @returns {Promise<UserEntity>} - The updated user entity.
   * @throws {StandardError} - Throws an error if user update fails.
   */
  async updateUser(id: string, updatedUser: UserEntity): Promise<UserEntity> {
    const user = await UserRepository.findOneById(id);
    if (!user) {
      throw new StandardError({
        code: UserErrorCode.USER_NOT_FOUND_ERROR,
        message: `User with id ${id} not found.`,
        status: HttpStatusCode.NotFound,
      });
    }

    const updatedUserEntity = {
      ...user,
      ...updatedUser,
      updatedAt: new Date(),
    };

    return await UserRepository.updateById(id, updatedUserEntity);
  }

  /**
   * Delete a user by ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<SuccessResponse>} - An object indicating if the deletion was successful.
   * @throws {StandardError} - Throws an error if user deletion fails.
   */
  async deleteUser(id: string): Promise<SuccessResponse> {
    const user = await UserRepository.findOneById(id);
    if (!user) {
      throw new StandardError({
        code: UserErrorCode.USER_NOT_FOUND_ERROR,
        message: `User with id ${id} not found.`,
        status: HttpStatusCode.NotFound,
      });
    }
    const isSuccess = await UserRepository.deleteById(id);
    return { success: isSuccess };
  }
}

export default UserService;
