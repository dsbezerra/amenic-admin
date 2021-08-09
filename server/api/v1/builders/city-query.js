const defaultQuery = require('./default-query');

/**
 * Builds Mongo query for cities endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const cityQueryBuilder = (request) => {
  const query = defaultQuery(request);

  if (request.query.id) {
    query.conditions._id = request.query.id;
  }

  if (request.query.stateId) {
    query.conditions.stateId = request.query.id;
  }

  return query;
};

module.exports = request => cityQueryBuilder(request);
