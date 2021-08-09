const { parseBoolean } = require('../../../../../utils/string');
const {
  BadRequestError,
} = require('../../helpers/errors');

/** Default limit of returned documents */
const DEFAULT_LIMIT = 10;

/** Min limit of returned documents */
const MIN_LIMIT = 1;

/** Max limit of returned documents */
const MAX_LIMIT = 50;

/**
 * Builds pagination payload from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Payload containing limit and offset values
 */
module.exports = (request) => {
  const result = {
    limit: DEFAULT_LIMIT,
    offset: 0,
    paginated: false,
  };

  if (request.query.limit) {
    const n = parseInt(request.query.limit, 10);
    if (Number.isNaN(n)) {
      throw BadRequestError('limit is invalid');
    }
    result.limit = Math.min(Math.max(n, MIN_LIMIT), MAX_LIMIT);
  } else if (request.query.per_page) {
    const n = parseInt(request.query.per_page, 10);
    if (Number.isNaN(n)) {
      throw BadRequestError('per_page is invalid');
    }
    result.limit = Math.min(Math.max(n, MIN_LIMIT), MAX_LIMIT);
    result.paginated = true;
  }

  if (request.query.skip) {
    const n = parseInt(request.query.skip, 10);
    if (Number.isNaN(n)) {
      throw BadRequestError('skip is invalid');
    }
    result.offset = n < 0 ? 0 : n;
  } else if (request.query.page) {
    let n = parseInt(request.query.page, 10) - 1; // 1-based pages
    if (Number.isNaN(n)) {
      throw BadRequestError('page is invalid');
    }
    n = n < 0 ? 0 : n;
    result.offset = n * result.limit;
    result.paginated = true;
  }

  if (request.query.paginated) {
    const b = parseBoolean(request.query.paginated);
    if (b !== null) {
      result.paginated = b;
    } else {
      throw BadRequestError('paginated is invalid');
    }
  }

  return result;
};
