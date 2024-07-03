/**
 * Define HTTP status codes and their corresponding names.
 */
export enum HttpStatusCode {
  /**
   * The request has succeeded.
   */
  OK = 200,

  /**
   * The request has been fulfilled and has resulted in one or more new resources being created.
   */
  Created = 201,

  /**
   * The request has been accepted for processing, but the processing has not been completed.
   */
  Accepted = 202,

  /**
   * The server has successfully fulfilled the request and that there is no additional content to send in the response payload body.
   */
  NoContent = 204,

  /**
   * The target resource resides temporarily under a different URI.
   */
  Found = 302,

  /**
   * The server cannot or will not process the request due to something that is perceived to be a client error.
   */
  BadRequest = 400,

  /**
   * The request has not been applied because it lacks valid authentication credentials for the target resource.
   */
  Unauthorized = 401,

  /**
   * The server understood the request but refuses to authorize it.
   */
  Forbidden = 403,

  /**
   * The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
   */
  NotFound = 404,

  /**
   * The method received in the request-line is known by the origin server but not supported by the target resource.
   */
  MethodNotAllowed = 405,

  /**
   * The request could not be completed due to a conflict with the current state of the target resource.
   */
  Conflict = 409,

  /**
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  InternalServerError = 500,

  /**
   * The server does not support the functionality required to fulfill the request.
   */
  NotImplemented = 501,

  /**
   * The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.
   */
  ServiceUnavailable = 503,
}

/**
 * Map of HTTP status codes to their corresponding names.
 */
export const HttpStatusName: Record<number, string> = {
  [HttpStatusCode.OK]: 'OK',
  [HttpStatusCode.Created]: 'Created',
  [HttpStatusCode.Accepted]: 'Accepted',
  [HttpStatusCode.NoContent]: 'No Content',
  [HttpStatusCode.Found]: 'Found',
  [HttpStatusCode.BadRequest]: 'Bad Request',
  [HttpStatusCode.Unauthorized]: 'Unauthorized',
  [HttpStatusCode.Forbidden]: 'Forbidden',
  [HttpStatusCode.NotFound]: 'Not Found',
  [HttpStatusCode.MethodNotAllowed]: 'Method Not Allowed',
  [HttpStatusCode.Conflict]: 'Conflict',
  [HttpStatusCode.InternalServerError]: 'Internal Server Error',
  [HttpStatusCode.NotImplemented]: 'Not Implemented',
  [HttpStatusCode.ServiceUnavailable]: 'Service Unavailable',
};
