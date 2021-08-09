const { parseBoolean } = require('../../../../utils/string');
const fieldQuery = require('./general/field-query');
const paginationQuery = require('./general/pagination-query');
const { BadRequestError } = require('../helpers/errors');

/**
 * Builds Mongo query for scores endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const scoreQueryBuilder = (request) => {
  const query = {
    conditions: {},
  };

  if (request.query.id) {
    query.conditions._id = request.query.id;
  }
  if (request.query.movie) {
    query.conditions.movieId = request.query.movie;
  }
  if (request.query.keepSynced) {
    const b = parseBoolean(request.query.keepSynced);
    if (b !== null) {
      query.conditions.keepSynced = b;
    } else {
      throw BadRequestError('keepSynced is invalid');
    }
  }

  return query;
};

module.exports = (request) => {
  let query = scoreQueryBuilder(request);

  query.select = fieldQuery(request);
  query = { ...query, ...paginationQuery(request) };

  return query;
};
