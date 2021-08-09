const fieldQuery = require('./general/field-query');
const paginationQuery = require('./general/pagination-query');

/**
 * Builds Mongo query for notification endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const notificationQueryBuilder = (request) => {
  const query = {
    conditions: {},
    sort: { createdAt: -1 },
  };

  if (request.query.type) {
    query.conditions.type = request.query.type;
  }

  return query;
};

module.exports = (request) => {
  let query = notificationQueryBuilder(request);

  query.select = fieldQuery(request);
  query = { ...query, ...paginationQuery(request) };

  return query;
};
