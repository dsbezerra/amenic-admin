const fieldQuery = require('./general/field-query');
const includeQuery = require('./general/include-query');
const paginationQuery = require('./general/pagination-query');
const sortQuery = require('./general/sort-query');

module.exports = (request) => {
  let query = {
    conditions: {},
    sort: sortQuery(request) || { createdAt: -1 },
    populate: includeQuery(request) || [],
  };

  query.select = fieldQuery(request);
  query = { ...query, ...paginationQuery(request) };

  return query;
};
