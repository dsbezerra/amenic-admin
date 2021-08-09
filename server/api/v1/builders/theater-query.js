const defaultQuery = require('./default-query');

/**
 * Builds Mongo query for theaters endpoints from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Mongo compatible query object
 */
const theaterQueryBuilder = (request) => {
  const query = defaultQuery(request);

  if (request.query.id) {
    query.conditions._id = request.query.id;
  }

  if (request.query.hidden) {
    query.conditions.hidden = request.query.hidden;
  }

  if (request.query.search) {
    query.conditions.$or = [
      { name: { $regex: request.query.search, $options: 'ig' } },
      { shortName: { $regex: request.query.search, $options: 'ig' } },
    ];
  }

  if (request.query.city || request.query.cityId) {
    query.conditions.cityId = request.query.city || request.query.cityId;
  }

  return query;
};

module.exports = request => theaterQueryBuilder(request);
