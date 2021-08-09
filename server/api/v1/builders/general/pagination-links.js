const getRooURL = require('../../../../../lib/api/getRootURL');
const buildQueryString = require('../../../../../lib/api/buildQueryString');

/**
 * Server root URL
 */
const ROOT_URL = getRooURL();

function constructPageLink(request, page) {
  const { query } = request;
  const { per_page, ...rest } = query;
  rest.page = page;
  return `${ROOT_URL}${request.baseUrl}?${buildQueryString(rest)}`;
}

/**
 * Builds pagination links from querystrings and paginated result
 * @param {Object} request The Express object to access querystrings
 * @param {Object} opts The options used to query Mongo
 * @param {Object} result Result of Mongo query with pagination data
 * @return {Object} Page links object
 */
module.exports = (request, opts, {
  totalCount,
  hasNextPage,
  hasPreviousPage,
}) => {
  const links = {
    first: null,
    previous: null,
    next: null,
    last: null,
  };

  const { offset, limit } = opts;

  let current = Math.floor(offset / limit) + 1; // 1-based page
  if (current < 0) {
    current = 0;
  }

  links.first = constructPageLink(request, 1);
  if (hasPreviousPage) {
    links.previous = constructPageLink(request, current - 1);
  }
  if (hasNextPage) {
    links.next = constructPageLink(request, current + 1);
  }

  const last = Math.floor(totalCount / (request.query.per_page || limit));
  if (last > 0) {
    links.last = constructPageLink(request, last + 1);
  }

  return links;
};
