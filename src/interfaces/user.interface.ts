import { Pagination } from './common.interface';

/**
 * Enum representing user-related error codes.
 */
export enum UserErrorCode {
  CREATE_NEW_USER_ERROR = 'CREATE_NEW_USER_ERROR',
  USER_NOT_FOUND_ERROR = 'USER_NOT_FOUND_ERROR',
  USER_UPDATE_ERROR = 'USER_UPDATE_ERROR',
  GET_USERS_ERROR = 'GET_USERS_ERROR',
}

/**
 * Interface representing the structure of a user entity in the system.
 */
export interface UserEntity {
  /**
   * The unique identifier for the user.
   * @type {string}
   */
  id: string;

  /**
   * The first name of the user.
   * @type {string} [Optional]
   */
  firstName?: string;

  /**
   * The last name of the user.
   * @type {string} [Optional]
   */
  lastName?: string;

  /**
   * The email address of the user.
   * @type {string} [Optional]
   */
  email?: string;

  /**
   * The phone number of the user.
   * @type {string} [Optional]
   */
  phoneNumber?: string;

  /**
   * The username of the user.
   * @type {string} [Optional]
   */
  username?: string;

  /**
   * The password of the user.
   * @type {string} [Optional]
   */
  password?: string;

  /**
   * Indicates whether the user is deleted.
   * @type {boolean} [Optional]
   * @default false
   */
  deleted?: boolean;

  /**
   * Indicates whether two-factor authentication is enabled for the user.
   * @type {boolean} [Optional]
   * @default false
   */
  is2FaEnable?: boolean;

  /**
   * The date and time when the user was created.
   * @type {Date} [Optional]
   * @default new Date()
   */
  createdAt?: Date;

  /**
   * The date and time when the user was last updated.
   * @type {Date} [Optional]
   * @default new Date()
   */
  updatedAt?: Date;
}

/**
 * Interface representing the data required to create a new user.
 */
export interface NewUser {
  /**
   * The first name of the user.
   * @type {string}
   */
  firstName: string;

  /**
   * The last name of the user.
   * @type {string}
   */
  lastName: string;

  /**
   * The email address of the user.
   * @type {string}
   */
  email: string;

  /**
   * The phone number of the user (optional).
   * @type {string}
   */
  phoneNumber?: string;

  /**
   * The username of the user.
   * @type {string}
   */
  username: string;

  /**
   * The password of the user.
   * @type {string}
   */
  password: string;
}

/**
 * Interface representing the filter criteria for finding users.
 */
export interface FindUsersFilter {
  /**
   * The page number for pagination.
   * @type {number}
   */
  page: number;

  /**
   * The number of items per page for pagination.
   * @type {number}
   */
  limit: number;

  /**
   * Indicates whether to include deleted users in the results.
   * @type {boolean} [Optional]
   */
  deleted?: boolean;

  /**
   * Indicates whether to filter users by two-factor authentication status.
   * @type {boolean} [Optional]
   */
  is2FaEnable?: boolean;

  /**
   * The first name to filter users by.
   * @type {string} [Optional]
   */
  firstName?: string;

  /**
   * The last name to filter users by.
   * @type {string} [Optional]
   */
  lastName?: string;
}

/**
 * Interface representing a list of users with pagination details.
 */
export interface FilteredListUsers {
  /**
   * Pagination details.
   * @type {Pagination}
   */
  pagination: Pagination;

  /**
   * List of user entities.
   * @type {UserEntity[]}
   */
  users: UserEntity[];
}
