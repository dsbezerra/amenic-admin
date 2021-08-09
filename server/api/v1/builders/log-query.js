const fieldQuery = require('./general/field-query');
const paginationQuery = require('./general/pagination-query');

/**
 * Builds Mongo query for log endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const logQueryBuilder = (request) => {
  const query = {
    conditions: {},
    sort: { Time: -1 },
  };

  if (request.query.app) {
    query.conditions.app = request.query.app;
  }

  return query;
};

module.exports = (request) => {
  let query = logQueryBuilder(request);

  query.select = fieldQuery(request);
  query = { ...query, ...paginationQuery(request) };

  return query;
};
