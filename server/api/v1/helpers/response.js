const {
  UNKNOWN,
  OPERATION_TIMEOUT,
  MOVIE_NOT_FOUND,

  makeError,
} = require('./errors');

/**
 * Helper to send an unknown error response.
 * @param {Response} res Express response object.
 * @param {String} msg Message of error.
 */
const sendUnknown = (res, msg) => {
  let message = msg;
  if (!msg) message = 'Unknown error.';
  res.json(makeError(UNKNOWN, message));
};

/**
 * Helper to send a timeout error response.
 * @param {Response} res Express response object.
 * @param {String} msg Message of error.
 */
const sendTimeout = (res, msg) => {
  let message = msg;
  if (!msg) message = 'Timeout.';
  res.json(makeError(OPERATION_TIMEOUT, message));
};

/**
 * Helper to send a movie not found error response.
 * @param {Response} res Express response object.
 * @param {String} msg Message of error.
 */
const sendMovieNotFound = (res, msg) => {
  let message = msg;
  if (!msg) message = 'Movie not found.';
  res.status(401).json(makeError(MOVIE_NOT_FOUND, message));
};

module.exports = {
  sendUnknown,
  sendTimeout,
  sendMovieNotFound,
};
