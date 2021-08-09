import buildQueryString from '../lib/api/buildQueryString';

export const defaultPaginationQuery = { page: 1, per_page: 15 };

const getOffset = (query) => {
  if (query.offset) {
    return query.offset;
  }

  let page = (query.page || defaultPaginationQuery.page) - 1;
  if (page < 0) {
    page = 0;
  }

  return page * (query.per_page || defaultPaginationQuery.per_page);
};

/**
 * Constructs pagination data to use in PaginatedComponent.
 */
export const getPagination = (pathname, query, data, totalCount, replaceUri) => {
  const pages = {};
  const newQuery = {
    page: query.page || defaultPaginationQuery.page,
  };
  if (query.page > 1) {
    pages.previous = `${pathname}?${buildQueryString({ ...newQuery, page: parseInt(newQuery.page, 10) - 1 }, false)}`;
  }
  const offset = getOffset(query);
  if (offset + data.length < totalCount) {
    pages.next = `${pathname}?${buildQueryString({ ...newQuery, page: parseInt(newQuery.page, 10) + 1 }, false)}`;
  }
  if (replaceUri && replaceUri.from && replaceUri.to) {
    Object.keys(pages).forEach((k) => {
      if (pages[k]) {
        pages[k] = pages[k].replace(replaceUri.from, replaceUri.to);
      }
    });
  }
  const limit = query.limit || query.per_page || defaultPaginationQuery.per_page;
  pages.first = `${pathname}?${buildQueryString({ ...newQuery, page: 1 }, false)}`;
  pages.last = `${pathname}?${buildQueryString({ ...newQuery, page: Math.ceil(totalCount / limit) }, false)}`;
  return {
    offset,
    limit,
    hasNextPage: !!pages.next,
    hasPreviousPage: !!pages.previous,
    pages,
    query,
  };
};
