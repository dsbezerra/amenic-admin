const fieldQuery = require('./general/field-query');
const paginationQuery = require('./general/pagination-query');

/**
 * Builds Mongo query for api-keys endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const apiKeyQueryBuilder = (request) => {
  const query = {
    conditions: {},
    sort: { iat: -1 },
  };

  if (request.query.owner) {
    query.conditions.owner = request.query.owner;
  }

  return query;
};

module.exports = (request) => {
  let query = apiKeyQueryBuilder(request);

  query.select = fieldQuery(request);
  query = { ...query, ...paginationQuery(request) };

  return query;
};
