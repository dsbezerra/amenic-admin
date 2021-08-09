const defaultQuery = require('./default-query');
const { parseBooleanProperty } = require('./general/filter-query');
const { BadRequestError } = require('../helpers/errors');

/**
 * Allowed ratings.
 *
 * -1 = Everyone
 *  0 = Not specified
 * 10 = 10 years old
 * 12 = 12 years old
 * 14 = 14 years old
 * 16 = 16 years old
 * 18 = 18 years old
 */
const ALLOWED_RATINGS = [-1, 0, 10, 12, 14, 16, 18];

/**
 * Builds Mongo query for movies endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const movieQueryBuilder = (request) => {
  const query = defaultQuery(request);

  if (request.query.id) {
    query.conditions._id = request.query.id;
  }

  if (request.query.hidden) {
    query.conditions.hidden = request.query.hidden;
  }

  if (request.query.backdrop) {
    query.conditions.backdrop = parseBooleanProperty(request.query.backdrop, '');
  }

  if (request.query.poster) {
    query.conditions.poster = parseBooleanProperty(request.query.poster, '');
  }

  if (request.query.trailer) {
    query.conditions.trailer = parseBooleanProperty(request.query.trailer, '');
  }

  if (request.query.rating) {
    const n = parseInt(request.query.rating, 10);
    if (Number.isNaN(n) || !ALLOWED_RATINGS.includes(n)) {
      throw BadRequestError('rating is invalid');
    }
    query.conditions.rating = n;
  }

  if (request.query.search) {
    query.conditions.$or = [
      { title: { $regex: request.query.search, $options: 'ig' } },
      { originalTitle: { $regex: request.query.search, $options: 'ig' } },
    ];
  }

  return query;
};

module.exports = request => movieQueryBuilder(request);
