import sendRequest from './sendRequest';
import buildQueryString from './buildQueryString';

const BASE_PATH = '/v2/cities';

/**
 * GET
 * /v2/states
 *
 * Retrieve list of cities.
 */
export const getCityList = (q = { limit: 30, sort: 'name' }, options = {}) => sendRequest(
  `${BASE_PATH}/?${buildQueryString(q)}`,
  Object.assign({ method: 'GET' }, options),
);
