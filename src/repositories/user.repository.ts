import { pool } from '../configs/db';
import Logger from '../lib/logger';
import {
  FilteredListUsers,
  FindUsersFilter,
  UserEntity,
} from '../interfaces/user.interface';
import { CaseConverter } from '../utils/case_converter';
import { last } from 'lodash';

/**
 * Repository class for handling database operations related to users.
 */
class UserRepository {
  /**
   * Insert a new user into the database.
   * @param {Partial<UserEntity>} user - Partial user entity containing the user data to insert.
   * @returns {Promise<UserEntity>} - The inserted user entity.
   * @throws {Error} - Throws an error if the insertion fails.
   */
  static async insert(user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const { firstName, lastName, email, phoneNumber, username, password } =
        user;

      const query = `
        INSERT INTO users (first_name, last_name, email, phone_number, username, password, deleted, is_2fa_enable, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;

      const values = [
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        false,
        false,
        new Date(),
        new Date(),
      ];

      const result = await pool.query(query, values);
      return CaseConverter.convertKeysToCamelCase(result.rows[0]);
    } catch (error: any) {
      Logger.error(`Error encountered inserting user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find a user by their ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserEntity>} - The user entity found, or null if not found.
   * @throws {Error} - Throws an error if the query fails.
   */
  static async findOneById(id: string): Promise<UserEntity> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1 AND deleted = false;';
      const result = await pool.query(query, [id]);
      return CaseConverter.convertKeysToCamelCase(result.rows[0]);
    } catch (error: any) {
      Logger.error(`Error encountered finding user by id: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all users that are not deleted.
   * @returns {Promise<UserEntity[]>} - An array of user entities.
   * @throws {Error} - Throws an error if the query fails.
   */
  static async findAll(): Promise<UserEntity[]> {
    try {
      const query = 'SELECT * FROM users WHERE deleted = false;';
      const result = await pool.query(query);
      return CaseConverter.convertKeysToCamelCase(result.rows);
    } catch (error: any) {
      Logger.error(`Error encountered finding all users: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find users based on a given filter.
   * @param {FindUsersFilter} filter - The filter criteria for finding users.
   * @returns {Promise<UserEntity[]>} - An array of user entities that match the filter.
   * @throws {Error} - Throws an error if the query fails.
   */
  static async findFiltered(
    filter: FindUsersFilter,
  ): Promise<FilteredListUsers> {
    try {
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const offset = (page - 1) * limit;
      const values = [];
      let whereClause = 'WHERE 1=1';

      if (filter) {
        if (filter.deleted !== undefined) {
          values.push(filter.deleted);
          whereClause += ` AND deleted = $${values.length}`;
        }
        if (filter.is2FaEnable !== undefined) {
          values.push(filter.is2FaEnable);
          whereClause += ` AND is_2fa_enable = $${values.length}`;
        }
        if (filter.firstName) {
          values.push(`%${filter.firstName}%`);
          whereClause += ` AND first_name ILIKE $${values.length}`;
        }
        if (filter.lastName) {
          values.push(`%${filter.lastName}%`);
          whereClause += ` AND last_name ILIKE $${values.length}`;
        }
      }

      const query = `
        SELECT *
        FROM users
        ${whereClause}
        ORDER BY updated_at DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2};
      `;
      const countQuery = `
        SELECT COUNT(*)
        FROM users
        ${whereClause};
      `;

      // Add limit and offset to values
      values.push(limit, offset);

      const { rows } = await pool.query(query, values);
      const { rows: countRows } = await pool.query(
        countQuery,
        values.slice(0, -2),
      ); // Exclude limit and offset
      const total = parseInt(countRows[0].count, 10);

      // Return the list of mapped users with pagination
      return {
        pagination: {
          page: filter.page,
          perPage: filter.limit,
          totalPages: Math.ceil(total / filter.limit),
          totalItems: total,
        },
        users: CaseConverter.convertKeysToCamelCase(rows),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a user by their ID with the given fields.
   * @param {string} id - The ID of the user to update.
   * @param {Partial<UserEntity>} user - Partial user entity containing the fields to update.
   * @returns {Promise<UserEntity>} - The updated user entity.
   * @throws {Error} - Throws an error if no fields to update are provided or if the update fails.
   */
  static async updateById(
    id: string,
    user: Partial<UserEntity>,
  ): Promise<UserEntity> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let index = 1;

      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        is2FaEnable,
        deleted,
      } = user;
      const userToUpdate = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        password,
        is_2fa_enable: is2FaEnable,
        deleted,
      };

      // Dynamically build query based on non-null fields
      for (const [key, value] of Object.entries(userToUpdate)) {
        if (value !== undefined) {
          updates.push(`${key} = $${index}`);
          values.push(value);
          index++;
        }
      }
      // add the id to the end of the values array
      values.push(id);

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${index}
        RETURNING *;
      `;

      const result = await pool.query(query, values);
      return CaseConverter.convertKeysToCamelCase(result.rows[0]);
    } catch (error: any) {
      Logger.error(`Error encountered updating user by id: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark a user as deleted by their ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<boolean>} - True if the user was successfully marked as deleted, otherwise false.
   * @throws {Error} - Throws an error if the deletion fails.
   */
  static async deleteById(id: string): Promise<boolean> {
    try {
      const query =
        'UPDATE users SET deleted = true, updated_at = $1 WHERE id = $2;';
      const result = await pool.query(query, [new Date(), id]);
      return (
        result !== null &&
        result !== undefined &&
        result.rowCount !== null &&
        result.rowCount !== undefined &&
        result.rowCount > 0
      );
    } catch (error: any) {
      Logger.error(`Error encountered deleting user by id: ${error.message}`);
    }
    return false;
  }
}

export default UserRepository;
