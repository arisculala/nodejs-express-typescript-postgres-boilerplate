/**
 * Common interfaces
 * Contains shared interfaces used across the application.
 */

/**
 * Pagination interface
 * Represents pagination details for a list of items.
 */
export interface Pagination {
  /**
   * The current page number.
   * @type {number}
   */
  page: number;

  /**
   * The number of items per page.
   * @type {number}
   */
  perPage: number;

  /**
   * The total number of pages.
   * @type {number}
   */
  totalPages: number;

  /**
   * The total number of items.
   * @type {number}
   */
  totalItems: number;
}

/**
 * SuccessResponse interface
 * Represents a generic response indicating the success of an operation.
 */
export interface SuccessResponse {
  /**
   * Indicates whether the operation was successful.
   * @type {boolean}
   */
  success: boolean;
}
