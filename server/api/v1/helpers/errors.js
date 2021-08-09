/**
 * 400 (Bad Request)
 *
 * 400 is the generic client-side error status, used when no other 4xx error code is appropriate.
 * Errors can be like malformed request syntax, invalid request message parameters,
 * or deceptive request routing etc.
 *
 * Source: https://restfulapi.net/http-status-codes/
 */
const StatusBadRequest = 400;

/**
 * 401 (Unauthorized)
 *
 * A 401 error response indicates that the client tried to operate on a protected resource without
 * providing the proper authorization. It may have provided the wrong credentials or none at all.
 *
 * Source: https://restfulapi.net/http-status-codes/
 */
const StatusUnauthorized = 401;

/**
 * Holds information about errors in the API.
 */
class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

/**
 * Creates a new BadRequest error
 * @param {*} message Message content
 */
const BadRequestError = message => new ApiError(StatusBadRequest, message);

/**
 * Creates a new Unauthorized error
 * @param {*} message Message content
 */
const UnauthorizedError = message => new ApiError(
  StatusUnauthorized, message || 'This action requires authentication',
);

module.exports = {
  // Unknown error code
  UNKNOWN: 0,

  // Error code for operation timeout
  OPERATION_TIMEOUT: 1000,

  // Error code for movie not found */
  MOVIE_NOT_FOUND: 1001,

  // Helper to create error object.
  makeError: (code, message) => ({ error: { code, message } }),

  ApiError,
  BadRequestError,
  UnauthorizedError,
};
